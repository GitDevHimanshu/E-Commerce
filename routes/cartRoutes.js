const { Router } = require("express");
const express = require('express');
const middleware = require('../middleware/middleware');
const cartcontroller  = require('../controllers/cartcontroller')

const router = Router();

router.use(express.static('uploads'));
router.use(express.static('uploads/profile/'));

router.route("/removefromcart")
    .delete(middleware.requireAuth, cartcontroller.removeFromCart);

router.route("/increaseqty")
    .patch(middleware.requireAuth, cartcontroller.increaseQuantity);

router.route("/decreaseqty")
    .patch(middleware.requireAuth, cartcontroller.decreaseQuantity);

router.route("/payment")
    .get(middleware.requireAuth, cartcontroller.proceedtoPayment);

router.route("/changeaddress")
    .patch(middleware.requireAuth, cartcontroller.changeAddress);

router.route('/placeorder')
    .post(middleware.requireAuth, cartcontroller.placeOrder)

// router.route('/checkout')
//     .post(middleware.requireAuth, cartcontroller.checkout);




module.exports = router;

