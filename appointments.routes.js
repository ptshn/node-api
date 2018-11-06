const router = require('express').Router();
const appointmentsController = require('../controllers/appointments.controller');
const Appointments = require('../models/Appointments');
const validateBody = require('../filters/validate-body');

router.get('/', appointmentsController.readAll)
router.get('/:id', appointmentsController.readById)
router.post('/', validateBody(Appointments), appointmentsController.create)
router.put('/:id', validateBody(Appointments), appointmentsController.updateById)
router.delete('/:id', appointmentsController.deleteById)
router.get('/:id/year/:year/month/:month', appointmentsController.readByMonthYear)

module.exports = router;
