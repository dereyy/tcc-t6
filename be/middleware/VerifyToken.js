import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log("[verifyToken] Auth header:", authHeader);
    
    if (!authHeader) {
      console.log("[verifyToken] No authorization header");
      return res.status(401).json({
        status: "Error",
        message: "Token tidak ditemukan"
      });
    }

    const token = authHeader.split(' ')[1];
    console.log("[verifyToken] Token:", token);

    if (!token) {
      console.log("[verifyToken] No token in header");
      return res.status(401).json({
        status: "Error",
        message: "Token tidak ditemukan"
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error("[verifyToken] Token verification failed:", err);
        return res.status(403).json({
          status: "Error",
          message: "Token tidak valid"
        });
      }
      
      console.log("[verifyToken] Token verified, decoded:", decoded);
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    console.error("[verifyToken] Error:", error);
    return res.status(500).json({
      status: "Error",
      message: "Terjadi kesalahan saat verifikasi token"
    });
  }
};
