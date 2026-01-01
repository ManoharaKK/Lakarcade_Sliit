const express = require('express');
const router = express.Router();
const {
  createArtisan,
  getAllArtisans,
  getArtisan,
  updateArtisan,
  deleteArtisan
} = require('../controllers/artisanController');

router.post('/', createArtisan);
router.get('/', getAllArtisans);
router.get('/:id', getArtisan);
router.put('/:id', updateArtisan);
router.delete('/:id', deleteArtisan);

module.exports = router;

