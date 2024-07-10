require("dotenv").config()
const jwt = require("jsonwebtoken")

module.exports.createSecretToken = (id, guidId, companyId) => {
    return jwt.sign({ id, guidId, companyId }, process.env.TOKEN_KEY, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};

module.exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) =>{
            if(err) return res.status(400).json({ message: "Invalid Token" });
            req.userId = decoded.id;
            req.guidId = decoded.guidId;
            req.companyId = decoded.companyId;
        });
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
}

