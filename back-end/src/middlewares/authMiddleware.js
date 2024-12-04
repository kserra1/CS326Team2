import jwt from 'jsonwebtoken';


//Verify token and attach the user object to the request
export const authenticateToken = (req, res, next) => {
    //Get token from request header:
    const token = req.headers['authorization']?.split(' ')[1]; 
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user; 
        next();
    });
};