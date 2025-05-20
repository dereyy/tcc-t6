import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ msg: "Refresh token tidak ditemukan" });

  const userRow = await User.findOne({ where: { refresh_token: token } });
  if (!userRow) return res.status(403).json({ msg: "User tidak ditemukan" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Refresh token tidak valid" });

    const safeData = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      gender: decoded.gender,
    };
    const accessToken = jwt.sign(safeData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30s",
    });
    res.json({ accessToken });
  });
};
