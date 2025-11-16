const Router = require('express');
const router = Router();
const validateToken = require('../middlewares/validateToken');
const upload = require('../middlewares/upload')
const {addIncident,getAllIncidents,acknowledgeInc} = require('../controllers/incidentCntrl');

router.route('/').post(upload.array('files', 5),addIncident).get(getAllIncidents);
router.route('/:id').patch(acknowledgeInc);


module.exports = router