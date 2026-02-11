const { SurveyClick, SurveyCompletion, Panelist, Survey } = require('../../../models');

class TrackingController {
    /**
     * Handle GoWeb callback
     * Expects: ?clickId=...&status=success|disqualify|terminate|overquota&uid=...
     */
    async handleGoWebCallback(req, res, next) {
        try {
            const { clickId, status, uid } = req.query;

            if (!clickId) return res.status(400).send('Missing clickId');

            // 1. Find the click record
            const click = await SurveyClick.findByPk(clickId, {
                include: [{ model: Survey, as: 'survey' }]
            });

            if (!click) return res.status(404).send('Click not found');

            // 2. Update click status
            const statusMap = {
                'success': 'completed',
                'disqualify': 'disqualified',
                'terminate': 'terminated',
                'overquota': 'overquota'
            };

            await click.update({ status: statusMap[status] || 'pending' });

            // 3. If success, create a completion record for reward processing
            if (status === 'success') {
                await SurveyCompletion.findOrCreate({
                    where: { click_id: click.id },
                    defaults: {
                        click_id: click.id,
                        panelist_id: click.panelist_id,
                        survey_id: click.survey_id,
                        status: 'complete',
                        payout: click.survey ? click.survey.payout : 0
                    }
                });
            }

            // 4. Redirect user back to frontend dashboard with a status message
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(`${frontendUrl}/dashboard?survey_status=${status}`);

        } catch (error) {
            console.error('Error in handleGoWebCallback:', error.message);
            next(error);
        }
    }
}

module.exports = new TrackingController();
