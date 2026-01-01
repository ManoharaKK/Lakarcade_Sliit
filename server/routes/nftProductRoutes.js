const express = require('express');
const router = express.Router();
const {
  createNFTProduct,
  getAllNFTProducts,
  getNFTProduct,
  updateNFTProduct,
  deleteNFTProduct
} = require('../controllers/nftProductController');

router.post('/', createNFTProduct);
router.get('/', getAllNFTProducts);
router.get('/:id', getNFTProduct);
router.put('/:id', updateNFTProduct);
router.delete('/:id', deleteNFTProduct);

module.exports = router;

