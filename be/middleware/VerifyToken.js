import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Baris yang ingin Anda tambahkan

  if (!token) {
    return res.status(401).json({ msg: "Token tidak ditemukan, akses ditolak" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "Token tidak valid, akses ditolak" });
    }
    req.user = decoded; // Simpan payload token ke req.user
    next();
  });
};
