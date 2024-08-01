const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test } = require('../controllers/authControllers');
const { registerUser, loginUser, getProfile,savework,getFiles,getFilesbyid,saveworkid,sharefile, deletefile} = require('../controllers/authControllers');
//middleware 
router.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  }));

router.get('/',test)
router.post('/register',registerUser);
router.post('/login', loginUser);
router.get('/profile',getProfile);
router.post('/editorsavework',savework);
router.get('/getFiles',getFiles);
router.get('/getFiles/:id',getFilesbyid);
router.post('/editorsaveworkid',saveworkid);
router.post('/sharefile',sharefile);
router.post('/deleteFile/:id',deletefile);
module.exports = router;