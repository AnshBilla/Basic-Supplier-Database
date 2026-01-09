const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/supplierController');

router.post('/add', ctrl.addSupplier);
router.get('/all', ctrl.getSuppliers);
router.get('/:id', ctrl.getSupplier);
router.put('/update/:id', ctrl.updateSupplier);
router.delete('/delete/:id', ctrl.deleteSupplier);

module.exports = router;
