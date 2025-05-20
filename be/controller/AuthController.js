import User from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  const { name, email, gender, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  try {
    await User.create({ name, email, gender, password: hash });
    res.json({ status: "Success", message: "Registrasi Berhasil" });
  } catch (e) {
    res.status(400).json({ status: "Error", message: "Email sudah terdaftar" });
  }
};

export const Login = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return res.status(404).json({ status: "Error", message: "User tidak ditemukan" });
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({ status: "Error", message: "Password Salah" });

  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    gender: user.gender,
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s",
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  await User.update(
    { refresh_token: refreshToken },
    { where: { id: user.id } }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    status: "Success",
    message: "Login berhasil",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender
    },
    accessToken
  });
};

export const Logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  await User.update(
    { refresh_token: null },
    { where: { refresh_token: token } }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  res.json({ message: "Logout berhasil" });
};
