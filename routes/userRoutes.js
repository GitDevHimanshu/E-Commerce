const { Router } = require("express");
const express = require('express'); 
const usercontroller = require("../controllers/usercontroller");
const authcontroller = require("../middleware/middleware")

const router = Router();

router.use(express.static('uploads/'));
router.use(express.static('uploads/profile/'));

router.route('/detail')
    .post(usercontroller.getProductDetail);

// router.route('/loadmoreproduct')
//     .post(authcontroller.requireAuth,usercontroller.getMoreProduct);

router.route('/addtocart')
    .post(authcontroller.requireAuth,usercontroller.addToCart);

router.route('/cartget')
    .get(authcontroller.requireAuth,usercontroller.cartGet);

router.route('/pageinc')
    .get(authcontroller.requireAuth,usercontroller.nextPage);


module.exports = router; 