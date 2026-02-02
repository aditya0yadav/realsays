const authService = require('./auth.service');

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: user.id
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

module.exports = {
    register,
    login,
    refresh,
    logout,
    getMe
};
