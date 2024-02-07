const { Router } = require("express");
const express = require('express');
const middleware = require("../middleware/middleware");
const sellercontroller = require('../controllers/sellercontroller');

const router = Router();

router.use(express.static('uploads'));
router.use(express.static('uploads/profile'));

router.route('/sellerhome')
    .get(sellercontroller.sellerHome);

router.route('/login')
    .get(sellercontroller.sellerloginGet)
    .post(sellercontroller.sellerloginPost)

router.route('/signup')
    .get(sellercontroller.sellerSignupGet)
    .post(sellercontroller.sellerSignupPost)

router.route('/seller_prod_delete')
    .delete(sellercontroller.sellerProductDelete)

module.exports = router;