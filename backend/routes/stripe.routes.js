import express from "express";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import { Router } from "express";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const DOWNLOAD_PRICE_CENTS = 199; // $1.99 — change this to whatever you want

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// ── POST /api/stripe/create-session ──────────────────────────────────────────
// Frontend calls this when user clicks "Go Premium" on a specific file
router.post("/create-session", authenticate, async (req, res) => {
  const { fileId, fileTitle, successUrl, cancelUrl } = req.body;

  if (!fileId) return res.status(400).json({ message: "fileId required" });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: DOWNLOAD_PRICE_CENTS,
            product_data: {
              name: fileTitle || "Document Download",
              description: "One-time download access",
            },
          },
          quantity: 1,
        },
      ],
      // Stripe replaces {CHECKOUT_SESSION_ID} automatically
      success_url: successUrl || `${process.env.FRONTEND_URL}/download/${fileId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  cancelUrl  || `${process.env.FRONTEND_URL}/dashboard`,
      metadata: {
        fileId,
        userId: req.user.id,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/stripe/verify-session ───────────────────────────────────────────
// DownloadPage calls this to verify payment before triggering download
router.get("/verify-session", authenticate, async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ valid: false });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Must be paid
    if (session.payment_status !== "paid")
      return res.json({ valid: false, reason: "not_paid" });

    // Must belong to this user
    if (session.metadata.userId !== req.user.id)
      return res.json({ valid: false, reason: "user_mismatch" });

    res.json({
      valid:  true,
      fileId: session.metadata.fileId,
    });
  } catch (err) {
    res.status(500).json({ valid: false, reason: err.message });
  }
});

export default router;