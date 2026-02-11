const { User, Panelist, RefreshToken } = require('../../models');
const { hashPassword, comparePassword } = require('../../utils/passwordHash');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokenGenerator');

const register = async (userData, userAgent) => {
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

    let panelist = null;
    // Create Panelist profile if role is panelist
    if (user.role === 'panelist') {
        panelist = await Panelist.create({
            user_id: user.id,
            first_name: userData.name ? userData.name.split(' ')[0] : 'User',
            last_name: userData.name ? userData.name.split(' ').slice(1).join(' ') : '',
            country_code: userData.countryCode
        });
    }

    // Generate tokens for immediate login
    const panelistId = panelist ? panelist.id : null;
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
            firstName: panelist ? panelist.first_name : null,
            lastName: panelist ? panelist.last_name : null
        },
        accessToken,
        refreshToken: refreshTokenString
    };
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

const googleLogin = async (decodedToken, userAgent) => {
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({
        where: { email },
        include: [{ model: Panelist, as: 'panelist' }]
    });

    if (!user) {
        // Create new user if they don't exist
        user = await User.create({
            email,
            password_hash: 'SOCIAL_AUTH_PROVIDER', // Placeholder, not used for Google Auth
            role: 'panelist',
            email_verified: true,
            google_id: uid
        });

        // Split name for panelist profile
        const nameParts = name ? name.split(' ') : ['User', ''];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        await Panelist.create({
            user_id: user.id,
            first_name: firstName,
            last_name: lastName,
            profile_picture: picture
        });

        // Re-fetch to include panelist profile
        user = await User.findByPk(user.id, {
            include: [{ model: Panelist, as: 'panelist' }]
        });
    }

    // Generate tokens
    const panelistId = user.panelist ? user.panelist.id : null;
    const accessToken = generateAccessToken(user, panelistId);
    const refreshTokenString = generateRefreshToken();

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

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

module.exports = {
    register,
    login,
    googleLogin,
    refreshAccessToken,
    logout
};
