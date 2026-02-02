const express = require('express');
const router = express.Router();
const authRoutes = require('../modules/auth/auth.routes');

router.use('/auth', authRoutes);
// router.use('/panel', panelRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

module.exports = router;
