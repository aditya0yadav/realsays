const { sequelize } = require('../../../config/database');
const { User, Panelist } = require('../../../models');

const { Op } = require('sequelize');
const { SurveyCompletion, Survey, SurveyProvider } = require('../../../models');

const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Users
        const totalUsers = await User.count();

        // 2. Total Earnings (Sum of lifetime_earnings from Panelists)
        const earningsResult = await Panelist.sum('lifetime_earnings');
        const totalEarnings = earningsResult || 0;

        // 3. Top 10 Earners
        const topEarners = await Panelist.findAll({
            limit: 10,
            order: [['lifetime_earnings', 'DESC']],
            include: [{
                model: User,
                as: 'user',
                attributes: ['email'],
            }],
            attributes: ['id', 'user_id', 'first_name', 'last_name', 'lifetime_earnings', 'balance', 'status']
        });

        // 4. Recent Signups (Last 5)
        const recentUsers = await User.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            attributes: ['id', 'email', 'created_at']
        });

        // 5. Signup Stats (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const signupStats = await User.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                created_at: {
                    [Op.gte]: sevenDaysAgo
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
        });

        // 6. Provider Analytics (Traffic from Panel Wise)
        const allProviders = await SurveyProvider.findAll({ attributes: ['id', 'name'] });
        const providerStats = await Promise.all(allProviders.map(async (provider) => {
            // Fix: Use literal and explicit table aliasing to avoid ambiguity in SQLite/Sequelize
            const completions = await SurveyCompletion.findAll({
                include: [{
                    model: Survey,
                    as: 'survey',
                    where: { provider_id: provider.id },
                    attributes: []
                }],
                attributes: [
                    [sequelize.literal('SurveyCompletion.status'), 'status'],
                    [sequelize.fn('COUNT', sequelize.literal('*')), 'count']
                ],
                group: [sequelize.literal('SurveyCompletion.status')],
                raw: true
            });

            // Format stats for this provider
            const statsMap = completions.reduce((acc, curr) => {
                const status = curr.status;
                const count = parseInt(curr.count || curr['count'] || 0);
                if (status) acc[status] = count;
                return acc;
            }, {});

            const total = Object.values(statsMap).reduce((a, b) => a + b, 0);
            const successful = statsMap['complete'] || 0;

            return {
                id: provider.id,
                name: provider.name,
                total,
                successful,
                successRate: total > 0 ? ((successful / total) * 100).toFixed(1) : "0.0",
                breakdown: statsMap
            };
        }));

        res.json({
            success: true,
            data: {
                totalUsers,
                totalEarnings: parseFloat(totalEarnings).toFixed(2),
                topEarners,
                recentUsers,
                signupStats,
                providerStats
            }
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ success: false, message: 'Server Error fetching stats', error: error.message });
    }
};

/**
 * Get paginated list of users with search and summary stats
 * GET /api/admin/users
 */
const getUsers = async (req, res) => {
    try {
        const { search, page = 1, limit = 10, sortBy = 'created_at', order = 'DESC', status, country, startDate, endDate } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        const panelistWhere = {};

        if (status) panelistWhere.status = status;
        if (country) panelistWhere.country_code = country;
        if (startDate && endDate) {
            whereClause.created_at = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        if (search) {
            whereClause[Op.or] = [
                { email: { [Op.like]: `%${search}%` } },
                { '$panelist.first_name$': { [Op.like]: `%${search}%` } },
                { '$panelist.last_name$': { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            include: [{
                model: Panelist,
                as: 'panelist',
                where: Object.keys(panelistWhere).length > 0 ? panelistWhere : null,
                required: Object.keys(panelistWhere).length > 0, // Inner join if filtering by panelist attributes
                attributes: ['first_name', 'last_name', 'status', 'lifetime_earnings', 'completions_count', 'balance', 'country_code']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, order]],
            distinct: true // Important for correct count with includes
        });

        const users = rows.map(user => ({
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            last_login: user.last_login,
            name: user.panelist ? `${user.panelist.first_name || ''} ${user.panelist.last_name || ''}`.trim() : 'N/A',
            status: user.panelist?.status || 'Active', // Default if no panelist? Or 'Incomplete'
            lifetime_earnings: parseFloat(user.panelist?.lifetime_earnings || 0),
            balance: parseFloat(user.panelist?.balance || 0),
            completions_count: user.panelist?.completions_count || 0
        }));

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};

/**
 * Get detailed report for a single user
 * GET /api/admin/users/:id
 */
const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: ['id', 'email', 'created_at', 'last_login', 'role', 'email_verified'],
            include: [{
                model: Panelist,
                as: 'panelist',
                include: [
                    // Include Survey Completions for history
                    {
                        model: SurveyCompletion,
                        as: 'survey_completions', // Make sure this alias exists in model or use default
                        limit: 50, // Limit history
                        order: [['created_at', 'DESC']],
                        include: [{ model: Survey, as: 'survey', attributes: ['title'] }]
                    }
                ]
            }]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Format data
        const panelist = user.panelist || {};
        const activityLog = (panelist.survey_completions || []).map(c => ({
            id: c.id,
            survey_title: c.survey ? c.survey.title : 'External Survey',
            status: c.status,
            payout: parseFloat(c.payout),
            date: c.created_at
        }));

        res.json({
            success: true,
            data: {
                profile: {
                    id: user.id,
                    email: user.email,
                    name: `${panelist.first_name || ''} ${panelist.last_name || ''}`.trim(),
                    status: panelist.status,
                    joined_at: user.created_at,
                    last_login: user.last_login,
                    verified: user.email_verified,
                    role: user.role
                },
                financials: {
                    balance: parseFloat(panelist.balance || 0),
                    lifetime_earnings: parseFloat(panelist.lifetime_earnings || 0),
                    pending_bonus: parseFloat(panelist.pending_bonus || 0)
                },
                stats: {
                    quality_score: panelist.quality_score,
                    total_surveys: panelist.completions_count || 0
                },
                activity_log: activityLog
            }
        });

    } catch (error) {
        console.error('Get User Details Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user details' });
    }
};

/**
 * Get Leaderboard (Top Earners)
 * GET /api/admin/leaderboard
 */
const getLeaderboard = async (req, res) => {
    try {
        const leaders = await Panelist.findAll({
            limit: 50,
            order: [['lifetime_earnings', 'DESC']],
            include: [{
                model: User,
                as: 'user',
                attributes: ['email', 'avatar_url']
            }],
            attributes: ['id', 'first_name', 'last_name', 'lifetime_earnings', 'completions_count', 'quality_score', 'country_code']
        });

        const data = leaders.map((p, index) => ({
            rank: index + 1,
            id: p.id,
            name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
            email: p.user ? p.user.email : 'Unknown', // Mask this in frontend if needed
            avatar: p.user ? p.user.avatar_url : null,
            earnings: parseFloat(p.lifetime_earnings),
            surveys: p.completions_count,
            score: p.quality_score,
            country: p.country_code
        }));

        res.json({ success: true, data });

    } catch (error) {
        console.error('Leaderboard Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
    }
};

module.exports = {
    getDashboardStats,
    getUsers,
    getUserDetails,
    getLeaderboard
};
