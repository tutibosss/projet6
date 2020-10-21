const express = require('express');
const router = express.Router();
const stuffCrtl = require('../controllers/stuff');

const auth = require('../middelware/auth')
const multer = require('../middelware/multer-config')

router.post('/sauces',auth, multer, stuffCrtl.creatSauce);
router.get('/sauces',auth, stuffCrtl.GetSauces);
router.get('/sauces/:id', auth, stuffCrtl.GetSauce);
router.put('/sauces/:id', auth, multer, stuffCrtl.modifSauce)
router.delete('/sauces/:id', auth, stuffCrtl.deleteSauce)
router.post('/sauces/:id/like', auth, stuffCrtl.likeSauce)


module.exports = router;