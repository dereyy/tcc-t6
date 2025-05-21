import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: "Token tidak ditemukan, akses ditolak" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "Token tidak valid, akses ditolak" });
    }
    req.userId = decoded.id; // Simpan userId dari token
    req.user = decoded; // Simpan seluruh data user
    next();
  });
};
