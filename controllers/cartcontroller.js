const jwt = require('jsonwebtoken');
const connection = require('../model/mysqldb');
const cartQuery = require('../model/cartQuery');

module.exports.removeFromCart = async(req, res) => {
    const result = await cartQuery.removefromCartQuery(req.body.cartid);
    if(result){
        res.json( { delete: 1 }) 
    } else {
        res.json( { delete: 0 } )
    }
}

module.exports.increaseQuantity = async (req, res) => {

    try {
        const result = await cartQuery.increaseQuantityQuery(req.body.pid, req.body.cartid);
        if(result){
            res.json({ increased: 1 });  
        } else {
            res.json({ increased: 0 });
        }
    } catch (error) {
        console.log(error);
        res.json({ increased: "nod" });
    }
};


module.exports.decreaseQuantity = async (req, res) => {
    try {
        const result = await cartQuery.decreaseQuantityQuery(req.body.cartid);
        if(result){
            res.json( { decreased: 1 }); 
        } else {
            res.json( { decreased: 0 } );
        }
    } catch (error) {
        console.log(error);
        res.json( { decreased: 0 } );
    }
}


module.exports.proceedtoPayment = async (req, res) => {
    try {
        const user = jwt.decode(req.cookies.jwt)
        const result = await cartQuery.proceedToPaymentQuery(user.userid);
        res.render('proceedtopayment.ejs', {cookie: 1, admin: 1, name: user.userid, photo: result.profile, cart_product: result.cart_product , totalbill: result.totalbill, address: result.address}); 
    } catch (error) {
        console.log(error);
    }  
}

module.exports.changeAddress = async (req, res) => {
    const user = jwt.decode(req.cookies.jwt);
    const result = await cartQuery.changeAddressQuerry(req.body.address, user.userid);
    if(result){
        res.json({updated: 1});
    } else {
        res.json({updated: 0});
    }
}

module.exports.placeOrder = (req, res) => {
    console.log("order body", req.body);
    connection.query("SELECT CART.*, P1.*, P2.*, CART.QUANTITY FROM CART INNER JOIN PRODUCT AS P1 ON CART.PRODUCT_ID = P1.ID INNER JOIN PRODUCT AS P2 ON CART.PRODUCT_ID = P2.ID WHERE CART.USER_ID = ?;",)
}
