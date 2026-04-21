import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token =
    req.headers.authorization?.split(" ")[1] || // Authorization: Bearer <token>
    req.body?.token ||                           // { token: "..." } in body
    req.query?.token;                            // ?token=... in URL

  if (!token) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};