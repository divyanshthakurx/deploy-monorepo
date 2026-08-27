import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authUser = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message: "Jwt token missing"
        });
    };

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded) {
            return res.json({
                message: "wrong jwt"
            });
        };
        const payload = decoded;
        req.userId = payload.userId;
        next();
    } catch (error) {
        console.error("error is", error);
        return res.status(403).json({
            message: "Invalid or expired token",
        });
    }
}