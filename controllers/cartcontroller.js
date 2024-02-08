const jwt = require('jsonwebtoken');
const connection = require('../model/mysqldb');
const cartQuery = require('../model/cartQuery');
const { v4:uuid, parse } = require( 'uuid' );
const { getDefaultHighWaterMark } = require('nodemailer/lib/xoauth2');

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

module.exports.placeOrder = async (req, res) => {
    let user = jwt.decode(req.cookies.jwt);

    const result = await cartQuery.placeOrderQuery(user.userid);
    const r = await cartQuery.insertIntoOrderQuery(result)
    const del = await cartQuery.deleteCartAfterPlaceOrder(result.user[0].id)
    if(del){
        res.status(200).end()
    } else{
        res.status(500).end()
    }
    // res.json(del);
    // connection.query('SELECT * FROM USER WHERE USERNAME = ? AND ROLE = ?', [user.userid, 0], (error, result) => {
    //     userdetail = result;

    //     connection.query("SELECT P.SELLER, P.PRICE, C.ID AS CART_ID , C.USER_ID, C.PRODUCT_ID, C.QUANTITY FROM PRODUCT P INNER JOIN CART C ON P.ID = C.PRODUCT_ID", (error, result) => {
    //         if(error){
    //             console.log(error)
    //         } else {
    //             for(let i = 0; i < result.length ; i++){
    //                 date = new Date()
    //                 uid = uuid();
    //                 total = parseFloat(result[i].PRICE * result[i].QUANTITY).toFixed(2);
    //                 let sql = "INSERT INTO ORDERS (ID, SELLERID, PRODUCTID, QUANTITY, TOTAL_PRICE, ORDERDATE, STATUS, USERID, ADDRESS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    //                 connection.query(sql, [uid, result[i].SELLER, result[i].PRODUCT_ID, result[i].QUANTITY, total , date , 0, userdetail[0].id, userdetail[0].address], (error, result) => {
    //                     if(error){
    //                         console.log(error);
    //                         res.json({order: "order failed"})
    //                     } else {
    //                         console.log('3');
    //                     }
    //                 })
    //             }
    //             connection.query('DELETE FROM CART WHERE USER_ID = ?', userdetail[0].id, (result, error) => {
    //                 if(error){
    //                     console.log(error);
    //                 } else {
    //                     console.log('4x');
    //                     res.json({ order: "order Placed"});
    //                 }
    //             })
    //         }
    //         // connection.query('SELECT * FROM PRODUCT WHERE )
    //         // let sql = 'SELECT P.SELLER, P.PRICE, CART(*) FROM PRODUCT P INNER JOIN CART C ON P.SELLER = C.PRODUCT_ID'
    //     } )
    // })
    // connection.query("SELECT CART.*, P1.*, P2.*, CART.QUANTITY FROM CART INNER JOIN PRODUCT AS P1 ON CART.PRODUCT_ID = P1.ID INNER JOIN PRODUCT AS P2 ON CART.PRODUCT_ID = P2.ID WHERE CART.USER_ID = ?;",)
}
