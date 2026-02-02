const jwt = require('jsonwebtoken');
const { User, Panelist } = require('../models');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user (without password)
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password_hash'] }
            });

            if (!user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            // Check if user is panelist and banned
            if (user.role === 'panelist' && decoded.panelistId) {
                const panelist = await Panelist.findByPk(decoded.panelistId);
                if (panelist && panelist.status === 'banned') {
                    res.status(403);
                    throw new Error('Access denied. Account is banned.');
                }
            }

            req.user = user;
            // Also attach panelistId if available for convenience
            if (decoded.panelistId) {
                req.panelistId = decoded.panelistId;
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            if (!res.headersSent) { // Prevent double response
                res.json({ message: 'Not authorized, token failed' });
            }
        }
    } else {
        res.status(401);
        res.json({ message: 'Not authorized, no token' });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            res.json({ message: 'Forbidden: You do not have permission to perform this action' });
            return;
        }
        next();
    };
};

module.exports = {
    protect,
    restrictTo
};
