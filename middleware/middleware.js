const jwt = require("jsonwebtoken");
const connection = require('../model/mysqldb');
require('dotenv').config()

module.exports.protectRoute = async (req,res,next) => {
    if(req.cookies.jwt){
        const us = jwt.decode(req.cookies.jwt);
        let temp; 
        connection.query("SELECT * FROM USER WHERE USERNAME = ?", [ us.userid ], ( error, result, field ) => {
            temp = result[0];
            connection.query( "SELECT * FROM product WHERE product_verified = ? LIMIT 5", [1], ( error, result, field ) => {
                res.render('userhome.ejs', {cookie: 1,admin: 1,  name: us.userid, product: result, photo: temp.profile});
            })
        }) 
    }
    else{
        next();
    }
}

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, process.env.userJWT , (err,decodedtoken) => {
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                next();
            }
        })
    }
    else{
        res.redirect('/login');
    }
}

module.exports.requireAdminAuth = (req, res, next) => {
    const token = req.cookies.admin;
    if(token){
        jwt.verify(token, process.env.adminJWT , (err,decodedtoken) => {
            if(err){
                console.log(err.message);
                res.redirect('/admin/login');
            }
            else{
                next();
            }
        })
    }
    else{
        res.redirect('/admin/login');
    }
}
