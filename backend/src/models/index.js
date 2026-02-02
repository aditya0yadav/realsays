const User = require('./auth/User.model');
const RefreshToken = require('./auth/RefreshToken.model');
const Panelist = require('./panel/Panelist.model');
const PanelistStatusHistory = require('./panel/PanelistStatus.model');

// User <-> Panelist
User.hasOne(Panelist, { foreignKey: 'user_id', as: 'panelist' });
Panelist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> RefreshToken
User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Panelist <-> PanelistStatusHistory
Panelist.hasMany(PanelistStatusHistory, { foreignKey: 'panelist_id', as: 'statusHistory' });
PanelistStatusHistory.belongsTo(Panelist, { foreignKey: 'panelist_id', as: 'panelist' });

// User (Admin) <-> PanelistStatusHistory (Change Log)
User.hasMany(PanelistStatusHistory, { foreignKey: 'changed_by', as: 'statusChanges' });
PanelistStatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'admin' });

// Export all models
module.exports = {
    User,
    Panelist,
    RefreshToken,
    PanelistStatusHistory
};
