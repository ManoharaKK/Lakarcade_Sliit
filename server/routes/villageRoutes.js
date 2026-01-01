const express = require('express');
const router = express.Router();
const {
  createVillage,
  getAllVillages,
  getVillage,
  updateVillage,
  deleteVillage
} = require('../controllers/villageController');

router.post('/', createVillage);
router.get('/', getAllVillages);
router.get('/:id', getVillage);
router.put('/:id', updateVillage);
router.delete('/:id', deleteVillage);

module.exports = router;

