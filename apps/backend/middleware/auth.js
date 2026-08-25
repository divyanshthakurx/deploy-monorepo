import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

const authUser = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        res.json({
            message: "Jwt token missing"
        });
        return;
    };

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded) {
            return res.json({
                message: "wrong jwt"
            });
        };
        const payload = decoded;
        req.userId = payload.userId,  
        next();
    } catch (error) {
        console.error("error is", error);
        return res.status(403).json({
            message: "Invalid or expired token",
        });
    }
}