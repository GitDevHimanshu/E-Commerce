const connection = require('./mysqldb');
const {v4:uuid} = require("uuid")

module.exports.removefromCartQuery = (cartId) => {
     return new Promise((resolve, reject) => {
        let sql = 'DELETE FROM CART WHERE ID = ?';
        connection.query(sql, [cartId], (error) => {
            if(error){
                reject(false);
            } else {
                resolve(true);
            }
        })
     })
}

module.exports.increaseQuantityQuery = (productId, cartId) => {
    return new Promise ((resolve, reject) => {
        let sql1 = 'SELECT QUANTITY FROM PRODUCT WHERE ID = ?';
        let sql2 = 'UPDATE CART SET QUANTITY = QUANTITY + 1 WHERE ID = ?';
        // let sql = 'UPDATE CART SET QUANTITY = (SELECT QUANTITY FROM PRODUCT WHERE ID = ? AND QUANTITY <> 0) + 1 WHERE ID = ?' 
        connection.query(sql1,[productId],(error, result) => {
            if(result[0].QUANTITY !== 0){
                connection.query(sql2, [cartId],(error) => {
                    if(error) {
                        reject(0);
                    } else { 
                        resolve(1); 
                    }
                })
            } 
        })
    })
}

module.exports.decreaseQuantityQuery = (cartId) => {
    return new Promise((resolve, reject) => {
        let sql2 = 'UPDATE CART SET QUANTITY = QUANTITY - 1 WHERE ID = ?';
        connection.query(sql2, [cartId], (error) => {
            if (error) {
                reject(0);
            } else {
                resolve(1);
            }
        });
    });
}

module.exports.proceedToPaymentQuery = (userId) => {
    return new Promise((resolve, reject) => {
        let sql1 = 'SELECT * FROM USER WHERE USERNAME = ?';
        let sql2 = 'SELECT CART.*, P1.*, P2.*, CART.QUANTITY FROM CART INNER JOIN PRODUCT AS P1 ON CART.PRODUCT_ID = P1.ID INNER JOIN PRODUCT AS P2 ON CART.PRODUCT_ID = P2.ID WHERE CART.USER_ID = ?;';
        let userinfo;

        connection.query(sql1, [userId], (error, result) => {
            userinfo = result;
            connection.query(sql2, [userinfo[0].id], (error, result) => {
                if(error){
                    reject(error);
                } else {
                    var total = 0;
                    var one;
                    result.forEach(element => {
                        one = element.PRICE * element.QUANTITY;
                        total += one
                    })
                    resolve({profile: userinfo[0].profile, cart_product: result, totalbill: total, address: userinfo[0].address});
                }
            })
        })
    })
}

module.exports.changeAddressQuerry = (address, userId) => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE USER SET ADDRESS = ? WHERE USERNAME = ?';
        connection.query(sql, [address,userId], (error) =>{
            if(error){
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}


module.exports.placeOrderQuery = (userid) => {
    return new Promise((resolve, reject) => {
        let user;
        let sql1 = 'SELECT * FROM USER WHERE USERNAME = ? AND ROLE = ?';
        let sql2 = 'SELECT P.SELLER, P.PRICE, C.ID AS CART_ID , C.USER_ID, C.PRODUCT_ID, C.QUANTITY FROM PRODUCT P INNER JOIN CART C ON P.ID = C.PRODUCT_ID'
        connection.query(sql1,[userid,0],(error, result) => {
            user = result;
            connection.query(sql2, (error, result) => {
                if(error){
                    reject(error);
                } else {
                    resolve({detail: result,user: user});
                }
            })
        })
    })
}

module.exports.insertIntoOrderQuery = (result) =>{
    return new Promise((resolve, reject)=>{
        let qry = "insert into ORDERS values ";
        result.detail.forEach(row =>{
            qry += `("${uuid()}","${row.SELLER}","${row.PRODUCT_ID}","${row.QUANTITY}","${row.QUANTITY*row.PRICE}",SYSDATE(),"0","${row.USER_ID}","${result.user[0].address}"), `
        } )
        qry = qry.substring(0, qry.length-2)
        connection.query(qry,(err,res)=>{
            err?reject(err):resolve(res);
        })   
    })
}

module.exports.deleteCartAfterPlaceOrder = (userid) => {
    return new Promise((resolve, reject) => {
        let sql = 'DELETE FROM CART WHERE USER_ID = ?';
        connection.query(sql, [userid], (error, result) => {
            error?reject(false):resolve(true);
        })
    })
}

