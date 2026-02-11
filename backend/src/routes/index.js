const express = require('express');
const router = express.Router();
const authRoutes = require('../modules/auth/auth.routes');
const personaRoutes = require('../modules/persona/persona.routes');
const userRoutes = require('../modules/user/routes/user.routes');
const surveyRoutes = require('../modules/survey/survey.routes');

router.use('/auth', authRoutes);
router.use('/persona', personaRoutes);
router.use('/user', userRoutes);
router.use('/survey', surveyRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

module.exports = router;
