const { User, Panelist, RefreshToken } = require('../../models');
const { hashPassword, comparePassword } = require('../../utils/passwordHash');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokenGenerator');

const register = async (userData) => {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await User.create({
        email: userData.email,
        password_hash: hashedPassword,
        role: userData.role || 'panelist'
    });

    // Create Panelist profile if role is panelist
    if (user.role === 'panelist') {
        await Panelist.create({
            user_id: user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            country_code: userData.countryCode
        });
    }

    return user;
};

const login = async (email, password, userAgent) => {
    const user = await User.findOne({
        where: { email },
        include: [{ model: Panelist, as: 'panelist' }]
    });

    if (!user || !(await comparePassword(password, user.password_hash))) {
        throw new Error('Invalid credentials');
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate tokens
    const panelistId = user.panelist ? user.panelist.id : null;
    const accessToken = generateAccessToken(user, panelistId);
    const refreshTokenString = generateRefreshToken();

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await RefreshToken.create({
        user_id: user.id,
        token: refreshTokenString,
        expires_at: expiresAt,
        user_agent: userAgent
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.panelist ? user.panelist.first_name : null,
            lastName: user.panelist ? user.panelist.last_name : null
        },
        accessToken,
        refreshToken: refreshTokenString
    };
};

const refreshAccessToken = async (token, userAgent) => {
    const storedToken = await RefreshToken.findOne({
        where: { token },
        include: [{
            model: User,
            as: 'user',
            include: [{ model: Panelist, as: 'panelist' }]
        }]
    });

    if (!storedToken) {
        throw new Error('Invalid refresh token');
    }

    // Check expiration
    if (new Date() > storedToken.expires_at) {
        await storedToken.destroy(); // Cleanup expired token
        throw new Error('Refresh token expired');
    }

    const { user } = storedToken;

    // Reject if user is banned (Passive Security)
    if (user.role === 'panelist' && user.panelist && user.panelist.status === 'banned') {
        await storedToken.destroy();
        throw new Error('Account is banned');
    }

    // Rotation: Delete old token, issue new one
    await storedToken.destroy();

    const newRefreshTokenString = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
        user_id: user.id,
        token: newRefreshTokenString,
        expires_at: expiresAt,
        user_agent: userAgent
    });

    const panelistId = user.panelist ? user.panelist.id : null;
    const newAccessToken = generateAccessToken(user, panelistId);

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshTokenString
    };
};

const logout = async (token) => {
    await RefreshToken.destroy({ where: { token } });
};

module.exports = {
    register,
    login,
    refreshAccessToken,
    logout
};
