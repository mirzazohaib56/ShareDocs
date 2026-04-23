import express    from "express";
import multer     from "multer";
import cloudinary from "cloudinary";
import { Router } from "express";
import jwt from "jsonwebtoken";

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

// ── Auth middleware ───────────────────────────────────────────────────────────
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const token = authHeader.split(" ")[1];
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });
      req.user = decoded; // user info now available in route handler
      next();
    });
  };



// ── Multer (memory storage — buffer passed directly to Cloudinary) ────────────
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      const allowed =
        ALLOWED_MIMETYPES.includes(file.mimetype) ||
        file.mimetype.startsWith("image/");
  
      if (!allowed) {
        return cb(new Error("File type not allowed"), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  });

// ── POST /api/upload ──────────────────────────────────────────────────────────
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinaryV2.uploader.upload_stream(
        {
          resource_type: "auto",   // use "raw" for PDFs
          folder: "uploads",         // Cloudinary folder name
          public_id: `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`,
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;