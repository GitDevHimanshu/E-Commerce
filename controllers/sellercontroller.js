const connection = require('../model/mysqldb');
const jwt = require('jsonwebtoken');
let{ v4:uuid } = require('uuid');

module.exports.sellerloginGet  = (req, res) => {
    try {
        if(req.cookies.seller) {
            res.redirect("/seller/sellerhome")
        } else {
            res.render('sellerlogin.ejs', {cookie: null, name: "guest", error: ""})
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.sellerloginPost = (req, res) => {
    try {
        // console.log(req.body.username);
        connection.query("SELECT * FROM USER WHERE USERNAME = ? AND ROLE = 1",[req.body.username],(error, result) => {
            // console.log(result);
            if(!result){
                return res.status(401).send.json({error: "Invalid Username"});
            }
            if(req.body.password === result[0].password){
                if(result[0].verifiedemail === 1) {
                    const token = jwt.sign({userid: result[0].username}, 'Seller-Gupt-Chabi-login', { expiresIn: Math.floor(Date.now() / 1000) + 3600 })
                    res.cookie("seller", token, { httpOnly: true, expires: new Date(Date.now() + 3600000) });
                    res.status(201).json({user: result[0].username});
                } else {
                    res.status(403).json({error: "Please Verify Your Email ID."});
                }
            } else {
                res.status(401).json({error: "Wrong Password!"});
            }
        })
    } catch (error) {
        console.log(error.message);
        res.json({ error: "internal server error" });
    }
}


module.exports.sellerSignupGet = (req, res) => {
    try {
        res.render('sellersignup', { cookie: null, name: "guest" });
    } catch (error) {
        console.log(error);
    }
}

module.exports.sellerSignupPost = (req, res) => {
    let verificationEmail;
    try {

     console.log(req.body);
     connection.query("SELECT * FROM USER WHERE USERNAME = ? AND ROLE = 1", [req.body.username],  (error, result, fields) => {
         if(result.length !== 0){
             throw Error("Username already taken");
         }
         else {
             verificationEmail = req.body.email; 
             let uid = uuid();            
             connection.query("INSERT INTO SELLER ( id, name, username, password, profile, verifiedemail) VALUES ( ?, ?, ?, ?, ?, ?);", [uid, req.body.name, req.body.username, req.body.password, req.file?.filename || "d5879ded22a4b5e16270e53536124f9c", 0], (error, result, fields) => {
                 if (error) {
                     console.log(error);
                 } else {
                    console.log(result);    
                     const param = jwt.sign({ userid: result.insertId }, "Seller-Gupt-Chabi-verify", {expiresIn: '1h'})
                    
                     const link = `http://localhost:3000/login?id=${param}`
                     
                     nodemailer.sendMail(req.body.username, link);
                     
                     res.redirect("/seller/login");    
                 }
             })
         }
     });
 
 
    } catch (error) {
      res.render("sellersignup.ejs", { cookie: null, name: "guest" })
      console.log(error);
    }
}

module.exports.sellerHome = (req,res) =>{
    let seller = jwt.decode(req.cookies.seller);
    let user_detail;
    connection.query("SELECT * FROM USER WHERE USERNAME = ? AND ROLE = 1",[seller.userid],(error, result) => {
       user_detail = result;
       connection.query("SELECT * FROM PRODUCT  Where seller = ?", [user_detail[0].id],(error, result) => {
            res.render('seller.ejs', {cookie: 1, admin: 0, name: user_detail[0].name , product: result, photo: user_detail[0].profile});
       })
    })




    // connection.query('SELECT * FROM PRODUCT INNER JOIN USER ON PRODUCT.SELLER = USER.ID WHERE ROLE = 1 AND PRODUCT_VERIFIED = 1',(error, result) => {
    //     if(error){
    //         console.log(error);
    //     } else {
    //         // res.render('seller.ejs', {cookie: 1, admin: 1, name: .userid, product: result.product, photo: result.user.profile});

    //     }
    // })
    // res.render('seller.ejs', {cookie: 1, admin: 1, name: user.userid, product: result.product, photo: result.user.profile});
}


module.exports.sellerProductDelete = (req, res) =>{
    connection.query('DELETE FROM PRODUCT WHERE ID = ?' , req.body.id ,( error, result ) => {
        if(error){
            console.log(error);
            res.json({delete: false})
        } else {
            res.json({delete: true})
        } 
    })
}

module.exports.sellerProductUpdate = (req, res) => {
    // console.log(req.body);
    let sql = 'UPDATE PRODUCT SET PRODNAME = ?, DESCRIPTION = ?, PRICE = ?, QUANTITY = ? WHERE ID = ?;'
    connection.query(sql,[req.body.name, req.body.description, req.body.price, req.body.quantity, req.body.id],(error, result) => {
        if(error){
            console.log(error);
            res.json({update : false});
        } else {
            res.json({update : true}); 
        }
    })
}

module.exports.sellerProductAdd = ( req, res ) => {
    let seller = jwt.decode(req.cookies.seller);
    let user_detail;
    connection.query("SELECT * FROM USER WHERE USERNAME = ? AND ROLE = 1",[seller.userid],(error, result) => {
       user_detail = result;
       connection.query("SELECT * FROM CART Where seller = ?", [user_detail[0].id],(error, result) => {
            res.render('seller.ejs', {cookie: 1, admin: 0, name: user_detail[0].name , product: result, photo: user_detail[0].profile});
       })
    })
}
