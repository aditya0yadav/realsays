const authService = require('./auth.service');
const jwt = require('jsonwebtoken');
const admin = require('../../config/firebaseAdmin');

const register = async (req, res, next) => {
    try {
        const userAgent = req.headers['user-agent'];
        const result = await authService.register(req.body, userAgent);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            ...result
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userAgent = req.headers['user-agent'];

        const result = await authService.login(email, password, userAgent);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(401);
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const userAgent = req.headers['user-agent'];

        const result = await authService.refreshAccessToken(refreshToken, userAgent);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(403);
        next(error);
    }
};

const adminLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Static Admin Credentials
        if (username === 'admin' && password === '12345678') {
            const token = jwt.sign(
                { role: 'admin', id: 'admin-static-id' },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.json({
                success: true,
                data: {
                    accessToken: token,
                    user: {
                        id: 'admin-static-id',
                        username: 'admin',
                        role: 'admin'
                    }
                }
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid admin credentials'
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};

const firebaseAuth = async (req, res, next) => {
    try {
        const { idToken } = req.body;
        const userAgent = req.headers['user-agent'];

        if (!idToken) {
            return res.status(400).json({ success: false, message: 'Firebase ID Token is required' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const result = await authService.firebaseLogin(decodedToken, userAgent);

        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Backend: Firebase Auth Error:', error.message);
        res.status(401);
        next(new Error('Invalid Firebase Token: ' + error.message));
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = await authService.changePassword(req.user.id, oldPassword, newPassword);
        res.json(result);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

module.exports = {
    register,
    login,
    adminLogin,
    firebaseAuth,
    refresh,
    logout,
    getMe,
    changePassword
};
