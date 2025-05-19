import User from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// GET
async function getUsers(req, res) {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// GET BY ID
async function getUserById(req, res) {
  try {
    const response = await User.findOne({ where: { id: req.params.id } });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// REGISTER //baru nambahin pasword dan bcrypt
async function createUser(req, res) {
  try {
    const { name, email, gender, password } = req.body;

    if (!name || !email || !gender || !password) {
      return res.status(400).json({ msg: "Semua field harus diisi" });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }

    const encryptPassword = await bcrypt.hash(password, 5);
    await User.create({
      name,
      email,
      gender,
      password: encryptPassword,
    });
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
}

//baru nambahin case password
async function updateUser(req, res) {
  try {
    const { name, email, gender, password } = req.body;
    let updatedData = {
      name,
      email,
      gender,
    }; //nyimpen jadi object

    if (password) {
      const encryptPassword = await bcrypt.hash(password, 5);
      updatedData.password = encryptPassword;
    }

    const result = await User.update(updatedData, {
      where: {
        id: req.params.id,
      },
    });

    // Periksa apakah ada baris yang terpengaruh (diupdate)
    if (result[0] === 0) {
      return res.status(404).json({
        status: "failed",
        message: "User tidak ditemukan atau tidak ada data yang berubah",
        updatedData: updatedData,
        result,
      });
    }

    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteUser(req, res) {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(201).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
  }
}

//Nambah fungsi buat login handler
async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Email dan password harus diisi" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Email atau password salah" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Email atau password salah" });
    }

    const userPlain = user.toJSON();
    const { password: _, refresh_token: __, ...safeUserData } = userPlain;

    const accessToken = jwt.sign(
      safeUserData,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m", // biasanya 15 menit
      }
    );
    const refreshToken = jwt.sign(
      safeUserData,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await User.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } }
    );

    // Atur secure: false jika di localhost/development
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 hari dalam milidetik
    });

    res.status(200).json({
      status: "Success",
      message: "Login berhasil",
      user: safeUserData,
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "Error",
      message: "Terjadi kesalahan server",
    });
  }
}

//nambah logout
async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken; //mgecek refresh token sama gak sama di database
  if (!refreshToken) return res.sendStatus(204);
  const user = await User.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user.refresh_token) return res.sendStatus(204);
  const userId = user.id;
  await User.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken"); //ngehapus cookies yg tersimpan
  return res.sendStatus(200);
}

function Me(req, res) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1]; // ambil token setelah "Bearer"
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    res
      .status(200)
      .json({ email: decoded.email, id: decoded.id, name: decoded.name });
  });
}

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginHandler,
  logout,
  Me,
};
