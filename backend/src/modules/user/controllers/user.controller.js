const { User, Panelist, PersonaAttribute, AttributeDefinition } = require('../../../models');

/**
 * Update user avatar
 */
const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const avatarUrl = `/uploads/${req.file.filename}`;

        await User.update(
            { avatar_url: avatarUrl },
            { where: { id: req.user.id } }
        );

        res.status(200).json({
            success: true,
            message: 'Avatar updated successfully',
            data: {
                avatarUrl: avatarUrl
            }
        });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update avatar'
        });
    }
};

/**
 * Get user profile info
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'avatar_url']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
};

/**
 * Get consolidated user profile summary (identity + persona)
 */
const getProfileSummary = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'avatar_url', 'role'],
            include: [
                {
                    model: Panelist,
                    as: 'panelist',
                    attributes: ['id', 'first_name', 'last_name', 'status', 'quality_score'],
                    include: [
                        {
                            model: PersonaAttribute,
                            as: 'attributes',
                            include: [
                                {
                                    model: AttributeDefinition,
                                    as: 'definition',
                                    attributes: ['key', 'title', 'type', 'options']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Flatten attributes for easier frontend consumption
        const profile = {
            id: user.id,
            email: user.email,
            avatar_url: user.avatar_url,
            role: user.role,
            name: user.panelist ? `${user.panelist.first_name || ''} ${user.panelist.last_name || ''}`.trim() : null,
            panelist: user.panelist ? {
                id: user.panelist.id,
                status: user.panelist.status,
                quality_score: user.panelist.quality_score,
                responses: user.panelist.attributes.reduce((acc, attr) => {
                    acc[attr.definition.key] = {
                        value: attr.value,
                        title: attr.definition.title,
                        type: attr.definition.type
                    };
                    return acc;
                }, {})
            } : null
        };

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Error fetching profile summary:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile summary'
        });
    }
};

module.exports = {
    updateAvatar,
    getProfile,
    getProfileSummary
};
