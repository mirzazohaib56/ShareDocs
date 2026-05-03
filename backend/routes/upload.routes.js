import express    from "express";
import multer     from "multer";
import cloudinary from "cloudinary";
import { Router } from "express";
import jwt        from "jsonwebtoken";
import File       from "../schema/file.schema.js";
import Stripe from "stripe";

const { v2: cloudinaryV2 } = cloudinary;
const router = Router();

const ALLOWED_MIMETYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed =
      ALLOWED_MIMETYPES.includes(file.mimetype) ||
      file.mimetype.startsWith("image/");
    if (!allowed) return cb(new Error("File type not allowed"), false);
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/", authenticate, async (req, res) => {
  const files = await File.find().sort({ createdAt: -1 });
  res.json(files);
});

router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    // 1. Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinaryV2.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "uploads",
          public_id: `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`,
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    // 2. Save entry to MongoDB
    const fileEntry = await File.create({
      title:       req.file.originalname,   // dummy: using original filename
      description: "No description",        // dummy
      tags:        ["untagged"],             // dummy
      url:         result.secure_url,
      publicId:    result.public_id,
      fileType:    req.file.mimetype,
      size:        req.file.size,
      uploadedBy:  req.user.id,            // from JWT decoded payload
    });

    // 3. Respond with both
    res.status(201).json({
      url:  result.secure_url,
      file: fileEntry,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/files/download-token ────────────────────────────────────────────
// Called after 3 files uploaded successfully → issues a 5-min download token
router.post("/download-token", authenticate, async (req, res) => {
  const { fileId } = req.body;
  if (!fileId) return res.status(400).json({ message: "fileId is required" });

  // Make sure the file actually exists
  const file = await File.findById(fileId);
  if (!file) return res.status(404).json({ message: "File not found" });

  const downloadToken = jwt.sign(
    { fileId, userId: req.user.id, type: "download" },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  res.json({ downloadToken });
});

// ── GET /api/files/download-token/verify ─────────────────────────────────────
// Called by DownloadPage before triggering the actual download
router.get("/download-token/verify", authenticate, async (req, res) => {
  const { token, fileId } = req.query;
  if (!token || !fileId) return res.status(400).json({ valid: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded.fileId:", decoded.fileId);
    console.log("query fileId:", fileId);
    console.log("decoded.userId:", decoded.userId);
    console.log("req.user.id:", req.user.id);
    console.log("fileId match:", decoded.fileId === fileId);
    console.log("userId match:", decoded.userId === req.user.id);

    if (decoded.type !== "download")    return res.json({ valid: false, reason: "invalid_type" });
    if (decoded.fileId !== fileId)      return res.json({ valid: false, reason: "file_mismatch" });
    if (decoded.userId !== req.user.id) return res.json({ valid: false, reason: "user_mismatch" });

    res.json({ valid: true });
  } catch (err) {
    // Catches expired tokens and tampered signatures
    res.json({ valid: false, reason: "expired_or_invalid" });
  }
});

// GET /api/files/:fileId — only accessible with valid download token OR stripe session
router.get("/:fileId", authenticate, async (req, res) => {
  const { token, session_id } = req.query;

  try {
    if (token) {
      // ... token logic
    } else if (session_id) {
      const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status !== "paid")
        return res.status(403).json({ message: "Payment not verified" });
      if (session.metadata.userId !== req.user.id)
        return res.status(403).json({ message: "User mismatch" });
      if (session.metadata.fileId !== req.params.fileId)
        return res.status(403).json({ message: "File mismatch" });
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: "File not found" });
    res.json(file);

  } catch (err) {
    console.log("error in /:fileId:", err.message);
    res.status(403).json({ message: "Access denied" });
  }
});

export default router;