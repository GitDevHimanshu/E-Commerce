const connection = require('./mysqldb');

module.exports.adminloginPostQuery = (username) =>{
    return new Promise((resolve,reject)=>{
        let sql = 'SELECT * FROM ADMIN WHERE USERNAME = ?';
        connection.query(sql, [username], (error, result) => {
            if(error){
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}

module.exports.adminHomeGetQuery = () => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM PRODUCT WHERE product_verified = ? LIMIT 5';
        connection.query(sql, [0], (error, result) => {
            if(error){
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}

module.exports.moveRightQuery = (offset) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM PRODUCT WHERE product_verified = ? LIMIT 5 OFFSET ?';
        connection.query(sql,[0,offset], (error, result) => {
            if(error){
                resolve(null);
            } else {
                resolve(result);
            }
        })
    })
}

module.exports.moveLeftQuery = (offset) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM PRODUCT WHERE product_verified = ? LIMIT 5 OFFSET ?';
        connection.query(sql,[0,offset], (error, result) => {
            if(error){
                resolve(null);
            } else {
                resolve(result);
            }
        })
    })
}

module.exports.approveProductQuery = (id, offset) => {
    return new Promise((resolve, reject) => {
        let sql1 = 'UPDATE PRODUCT SET product_verified = ? WHERE ID = ?';
        let sql2 = 'SELECT * FROM PRODUCT WHERE product_verified = ? LIMIT 5 OFFSET ?';
        connection.query(sql1, [1,id], (error, result) => {
            connection.query(sql2, [0, offset], (error, result) => {
                if(error){
                    reject();
                } else {
                    resolve(result);
                }
            })
        })
    })
}


module.exports.deleteProductQuery = (id, offset) => {
    return new Promise((resolve, reject) => {
        sql1 = 'DELETE FROM PRODUCT WHERE ID = ?';
        sql2 = 'SELECT * FROM PRODUCT WHERE product_verified = ? LIMIT 5 OFFSET ?';
        connection.query(sql1, [id], (error, result) => {
            connection.query(sql2, [0, offset], (error, result) => {
                if(error) {
                    reject();
                } else {
                    resolve(result);
                }
            })
        })
    })
}

module.exports.addProductQuery = (filename, naam, description, price, quantity) => {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO PRODUCT (PHOTO, PRODNAME, DESCRIPTION, PRICE, QUANTITY, SELLER) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(sql, [filename, naam, description, price, quantity, "admin"], (error, result) => {
            if(error){
                console.log(error);
                reject(0);
            } else {
                resolve(1);
            }
        })
    })
}

module.exports.viewProductsQuery = () => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM PRODUCT LIMIT 10';
        connection.query(sql, (error, result) => {
            if(error){
                reject();
            } else {
                resolve(result);
            }
        })
    })
}

module.exports.deleteProdQuery = (id, limit) => {
    return new Promise((resolve, reject) => {
        sql1 = 'DELETE FROM PRODUCT WHERE ID = ?';
        sql2 = 'SELECT * FROM PRODUCT LIMIT ?';
        connection.query(sql1, [id], (error, result) => {
            connection.query(sql2, [limit], (error, result) => {
                if(error){
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    })
}