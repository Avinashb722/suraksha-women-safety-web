const Router = require("express");
const router = Router();
const validateToken = require('../middlewares/validateToken');
const { sendemergencyCntrl,getAllEmergencies,getSinglEmergency,emergencyUpdate } = require("../controllers/emergencyCntrl");

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Emergency service is running',
        timestamp: new Date().toISOString()
    });
});

router.route("/emergencyPressed").post(sendemergencyCntrl);
router.route('/').get(getAllEmergencies)
router.route('/:id').get(getSinglEmergency).patch(emergencyUpdate)
module.exports = router;
