import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log("Attempting to refresh token...");
        
        if(!refreshToken) {
            console.log("No refresh token found in cookies");
            return res.status(401).json({ msg: "Refresh token tidak ditemukan" });
        }

        const user = await User.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if(!user) {
            console.log("User not found for refresh token");
            return res.status(403).json({ msg: "User tidak ditemukan" });
        }

        if(!user.refresh_token) {
            console.log("No refresh token found in user record");
            return res.status(403).json({ msg: "Refresh token tidak valid" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                console.log("Refresh token verification failed:", err.message);
                return res.status(403).json({ msg: "Refresh token tidak valid atau expired" });
            }

            console.log("Refresh token verified, generating new access token");
            const userPlain = user.toJSON();
            const { password: _, refresh_token: __, ...safeUserData } = userPlain;
            
            // Generate new access token with 30 seconds expiration
            const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30s'
            });

            console.log("New access token generated");
            res.json({ accessToken });
        });
    } catch(error) {
        console.error("Error in refreshToken:", error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
}