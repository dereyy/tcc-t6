import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const { refreshToken } = req.body;
        console.log('Received refresh token request:', { refreshToken });
        
        if (!refreshToken) {
            console.log('No refresh token provided');
            return res.status(401).json({ msg: "Refresh token tidak ditemukan" });
        }

        const user = await User.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) {
            console.log('User not found for refresh token');
            return res.status(403).json({ msg: "Refresh token tidak valid" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log('Token verification failed:', err.message);
                return res.status(403).json({ msg: "Refresh token expired" });
            }

            const userPlain = user.toJSON();
            const { password: _, refresh_token: __, ...safeUserData } = userPlain;

            // Generate new tokens
            const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30s'
            });
            const newRefreshToken = jwt.sign(safeUserData, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '7d'
            });

            // Update user's refresh token in database
            User.update(
                { refresh_token: newRefreshToken },
                { where: { id: user.id } }
            );

            res.json({
                accessToken,
                refreshToken: newRefreshToken
            });
        });
    } catch (error) {
        console.error('Error in refresh token:', error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
}