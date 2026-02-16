const admin = require('../config/firebaseAdmin');
const { User, Panelist } = require('../models');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Verify Firebase ID Token
            token = req.headers.authorization.split(' ')[1];

            // Verify Firebase ID Token
            const decodedToken = await admin.auth().verifyIdToken(token);

            // Find user by Google ID (Firebase UID)
            let user = await User.findOne({
                where: { google_id: decodedToken.uid },
                attributes: { exclude: ['password_hash'] }
            });

            // Fallback: If not found by google_id, try by email (especially for older accounts or email login)
            if (!user) {
                user = await User.findOne({
                    where: { email: decodedToken.email },
                    attributes: { exclude: ['password_hash'] }
                });

                // If found by email but missing google_id, update it
                if (user && !user.google_id) {
                    user.google_id = decodedToken.uid;
                    await user.save();
                }
            }

            if (!user) {
                res.status(401);
                throw new Error('Not authorized, user not found in database');
            }

            // Fetch panelist data if available
            const panelist = await Panelist.findOne({ where: { user_id: user.id } });

            if (panelist && panelist.status === 'banned') {
                res.status(403);
                throw new Error('Access denied. Account is banned.');
            }

            req.user = user;
            if (panelist) {
                req.panelistId = panelist.id;
            }

            next();
        } catch (error) {
            console.error('Middleware Auth Error for token:', token?.substring(0, 10) + '...', error.message);
            res.status(401);
            if (!res.headersSent) {
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
