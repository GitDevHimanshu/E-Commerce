const { Router } = require('express');
const express = require('express');
const admincontroller = require("../controllers/admincontroller");
const middleware = require("../middleware/middleware");


const multer = require('multer');
const storage = multer.diskStorage( {
    destination: (req, file, cb) => {
        if(req.path === '/signup'){
            cb(null, 'uploads/profile')
        }
        else{
            cb(null, 'uploads')
        }
    },
    onFileUploadStart: function(file, req, res){
        if(file.files.file.length >= 256000){
            return false;
        }
    }
} )

const upload = multer( {storage: storage} )

const router = Router();

router.use(express.static('uploads'))
router.use(express.static('uploads/profile/'));


router.route('/login')
    .get(admincontroller.adminloginGet)
    .post(admincontroller.adminloginPost)

router.route('/adminhome')
    .get(middleware.requireAdminAuth,admincontroller.adminHomeGet)

router.route('/moveright')
    .get(admincontroller.moveRight)

router.route('/moveleft')
    .get(admincontroller.moveLeft)

router.route('/approve')
    .post(admincontroller.approveProductDetails)

router.route('/delete')
    .post(admincontroller.deleteProduct)

router.route('/addproduct')
    .post(upload.single('image'),admincontroller.addProduct)

router.route('/viewproducts')
    .get(middleware.requireAdminAuth, admincontroller.viewproducts)

router.route('/deleteprod')
    .delete(middleware.requireAdminAuth, admincontroller.deleteProd)

module.exports = router;