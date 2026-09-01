const jwt = require('jsonwebtoken');

function extractToken(req) {
    if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
}

async function Authartist(req, res, next) {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized - Token missing"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "Only artists have access to this resource" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Unauthorized - Invalid token"
        });
    }
}

async function AuthUser(req, res, next) {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized - Token missing"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Unauthorized - Invalid token"
        });
    }
}

async function OptionalAuthUser(req, res, next) {
    const token = extractToken(req);

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        req.user = null;
    }
    next();
}

module.exports = { Authartist, AuthUser, OptionalAuthUser };