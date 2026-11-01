/**
 * Định tuyến (Routes) cho dữ liệu nền (Categories, Departments, Users)
 */
const express = require('express');
const router = express.Router();
const MasterDataController = require('../controllers/masterDataController');

router.get('/categories', MasterDataController.getCategories);
router.get('/departments', MasterDataController.getDepartments);
router.get('/users', MasterDataController.getUsers);

module.exports = router;
