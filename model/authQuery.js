const connection = require('./mysqldb');
const { v4:uuid } = require('uuid');

module.exports.loginPostQuery = (username) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM USER WHERE USERNAME = ?";
        connection.query(sql,[username],(error, result) => {
            if (error){
                reject(error);
            } else {
                resolve(result[0]);
            }
        })
    })
}

module.exports.getHomeQuery = () => {
    return new Promise((resolve,reject) => {
        let sql = `SELECT * FROM product WHERE product_verified = ? LIMIT 10`;
        connection.query(sql, [1], (error, result) => {
            if(error){
                console.log(error);
                reject();
            } else {
                resolve(result);
            }
        })
    })
}


module.exports.loginGetQuery = (userid) => {
    console.log(userid);
    return new Promise((resolve, reject) => {
        let sql = "UPDATE USER SET VERIFIEDEMAIL = 1 WHERE ID = ?";
        connection.query(sql,userid,(error, result) =>{
            if(error){
                reject(error);
            } else {
                resolve();
            }
        })
    })
}


module.exports.signupPostQuery = (uid,naam, username, password, filename, verified, address, phone, role) => {
    return new Promise((resolve, reject) => {
        const sql1 = "SELECT * FROM USER WHERE USERNAME = ?";
        const sql2 = "INSERT INTO user (id, name, username, password, profile, verifiedemail, address, phone, role) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?);";
        connection.query(sql1, [username], (error, result) => {
            if (result.length !== 0) {
                reject("Username already taken");
            } else {
                connection.query(sql2, [ uid ,naam, username, password, filename, verified, address, phone, role], (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
};

module.exports.userhomeGetQuery = (userid) => {
    return new Promise(( resolve, reject ) => {
        const sql1 = "SELECT * FROM USER WHERE USERNAME = ?";
        const sql2 = "SELECT * FROM product WHERE product_verified = ? LIMIT 5";
        let loggedin_user;
        connection.query(sql1,[userid], (error, result) => {
            loggedin_user = result;
            connection.query(sql2,[1],(error, result) => {
                if(error){
                    reject(error);
                } else {
                    resolve({product: result, user: loggedin_user[0]});
                }
            })
        })
    })
}

module.exports.forgotPasswordPostQuery = (email) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM USER WHERE USERNAME = ?";
        connection.query(sql, [email], (error, result) => {
            if(result.length === 0){
                resolve('No account associated with this email');
            } else {
                resolve("ok")
            }
        })
    })
}

module.exports.changePasswordPostQuery = (newpass, userid) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE USER SET PASSWORD = ? WHERE USERNAME = ?";
        connection.query(sql, [newpass, userid], (error, result) => {
            if(error) {
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}
