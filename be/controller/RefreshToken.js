import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json({ msg: "Refresh token tidak ditemukan" });

        const user = await User.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if(!user) return res.status(403).json({ msg: "User tidak ditemukan" });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.status(403).json({ msg: "Refresh token tidak valid" });

            const userPlain = user.toJSON();
            const { password: _, refresh_token: __, ...safeUserData } = userPlain;
            
            const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30s'
            });

            res.json({ accessToken });
        });
    } catch (error) {
        console.error("Error in refreshToken:", error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
}