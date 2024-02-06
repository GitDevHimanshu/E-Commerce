const connection = require('../model/mysqldb');
const jwt = require('jsonwebtoken');

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
        
    } catch (error) {
        
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
     connection.query("SELECT * FROM SELLER WHERE USERNAME = ?", [req.body.username],  (error, result, fields) => {
         if(result.length !== 0){
             throw Error("Username already taken");
         }
         else {
             verificationEmail = req.body.email;             
             connection.query("INSERT INTO SELLER ( name, username, password, profile, verifiedemail) VALUES ( ?, ?, ?, ?, ?);", [req.body.name, req.body.username, req.body.password, req.file?.filename || "d5879ded22a4b5e16270e53536124f9c", 0], (error, result, fields) => {
                 if (error) {
                     console.log(error);
                 } else {
                    //  console.log(result.insertId);
                     const param = jwt.sign({ userid: result.insertId }, "Seller-Gupt-Chabi", {expiresIn: '1h'})
                    
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