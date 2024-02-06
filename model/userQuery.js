const connection = require("./mysqldb");

module.exports.getProductDetailQuery = (prod_id) =>{
    return new Promise((resolve, reject) => {
        sql = "SELECT * FROM PRODUCT WHERE ID = ?";
        connection.query(sql,[prod_id], (error, result) => {
            if(error){
                console.log(error);
                reject(error)
            } else {
                resolve(result[0]);
            }
        })
    })
}

module.exports.addToCartQuery = (userid, reqId) => {
    return new Promise((resolve, reject) => {
        let sql1 = 'SELECT * FROM USER WHERE username = ?';
        let sql2 = 'SELECT * FROM PRODUCT WHERE ID = ?';
        let sql3 = 'SELECT * FROM CART WHERE PRODUCT_ID = ? && USER_ID = ?';
        let sql4 = 'INSERT INTO CART (USER_ID, PRODUCT_ID, QUANTITY) VALUE (?,?,?)';
        let user_detail;
        let product_detail;
        connection.query(sql1,[userid],(error, result) => {
            user_detail = result;
            connection.query(sql2,[reqId],(error, result) => {
                product_detail = result;
                connection.query(sql3,[reqId, user_detail[0].id], (error, result) => {
                    if(result.length === 0){
                        connection.query(sql4,[user_detail[0].id, reqId, 1], (error, result) => {
                            if(error){
                                console.log(error);
                                reject(false);
                            } else {
                                resolve(true);
                            }
                        })
                    } else {
                        reject(false);
                    }      
                })
            })
        })
    })
}



module.exports.cartGetQuery = (user) => {
    return new Promise((resolve, reject) => {
        let sql1 = 'SELECT * FROM USER WHERE USERNAME = ?';
        let sql2 = 'SELECT * FROM PRODUCT INNER JOIN CART ON PRODUCT.ID = CART.PRODUCT_ID WHERE CART.USER_ID = ?';
        let idExtract;
        connection.query(sql1,[user],(error, result) => {
            idExtract = result;
            connection.query(sql2, [idExtract[0].id],(error, result) => {
                if(error){
                    reject(error);
                } else {
                    resolve({ product: result, user: idExtract[0]});
                }
            })
        })
    })
}

module.exports.nextPageQuery=(is_verified,limit,offset)=>{
    return new Promise((resolve,reject)=>{
        const sql="SELECT * FROM PRODUCT WHERE product_verified = ? LIMIT ? OFFSET ?";
        connection.query(query,[is_verified,limit,offset],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}

module.exports.previousPageQuery=(is_verified,limit,offset)=>{
    return new Promise((resolve,reject)=>{
        const sql="SELECT * FROM PRODUCT WHERE product_verified = ? LIMIT ? OFFSET ?";
        connection.query(query,[is_verified,limit,offset],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}

