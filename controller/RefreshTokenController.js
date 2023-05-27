const { RefreshToken, User } = require("../models");
const jwt = require("jsonwebtoken");

const logoutAllSessions = async (req, res) => {
    try {
        const userId = req.user._id;

        // Delete all refresh tokens associated with the user
        await RefreshToken.deleteMany({ userId });

        res.status(200).json({ message: "User logged out from all sessions" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const generateAccessToken = (user) => {
    const accessToken = jwt.sign(
        {
            id: user._id,
            userName: user.userName
        },
        process.env.JWT_TOKEN,
        { expiresIn: "60 minutes" }
    );
    return accessToken;
};



const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Verify the refresh token
        const decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Check if the refresh token exists in the database
        const refreshTokenDoc = await RefreshToken.findOne({ token: refreshToken });
        if (!refreshTokenDoc) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        // Check if the refresh token is associated with a user
        const user = await User.findById(decodedToken.user._id);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Generate a new access token
        const accessToken = generateAccessToken(user);

        // Return the new access token
        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    logoutAllSessions,
    refreshAccessToken
};
