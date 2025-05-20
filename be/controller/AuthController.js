import User from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
    const { name, email, gender, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await User.create({
            name: name,
            email: email,
            gender: gender,
            password: hashPassword
        });
        res.json({ 
            status: "Success",
            message: "Registrasi Berhasil" 
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ 
            status: "Error",
            message: "Email sudah terdaftar" 
        });
    }
}

export const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) return res.status(404).json({ 
            status: "Error",
            message: "User tidak ditemukan" 
        });
        
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({ 
            status: "Error",
            message: "Password Salah" 
        });
        
        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const gender = user.gender;
        
        const accessToken = jwt.sign({ userId, name, email, gender }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({ userId, name, email, gender }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        
        await User.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.json({ 
            status: "Success",
            message: "Login berhasil",
            user: {
                id: userId,
                name: name,
                email: email,
                gender: gender
            },
            accessToken: accessToken
        });
    } catch (error) {
        res.status(404).json({ 
            status: "Error",
            message: "Email tidak ditemukan" 
        });
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await User.findOne({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user) return res.sendStatus(204);
    const userId = user.id;
    await User.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.json({
        status: "Success",
        message: "Logout berhasil"
    });
} 