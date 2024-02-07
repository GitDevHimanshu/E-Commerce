const jwt = require("jsonwebtoken");
const nodemailer = require("../methods/nodemailer");
const authQuery = require("../model/authQuery");
require('dotenv').config()
const { v4: uuid } = require('uuid');


module.exports.getHome = async (req, res) => {
    try {
        const result = await authQuery.getHomeQuery();
        res.render('home.ejs', {cookie: null, admin: 1, name: "guest", product: result})
    } catch (error) {
        console.log(error);
    }
}

module.exports.signupGet = (req,res) => {   
    try {
        res.render('signup', { cookie: null, name: "guest" });
    } catch (error) {
        console.log(error);
    }
}

module.exports.loginGet = async (req,res) => {
    
    try {
        if(req.query.id){
            jwt.verify(req.query.id, process.env.verifyJWT , async (err, decodedtoken) => {
                if (err){
                    console.log(err);   
                    res.render('login', { cookie: null, name: "guest" , error: " user not verified"});
                }
                else{
                    console.log(decodedtoken);
                    const result = await authQuery.loginGetQuery(decodedtoken.userid);
                    res.render('login', { cookie: null, name: "guest" , error: " "});
                }
            }) 
        }
        else{
            res.render('login', { cookie: null, name: "guest" , error: " "});
        }   
    } catch (error) {
        console.log('error');
    }
}

module.exports.signupPost = async (req,res) => {
   try {
    let file = req.body.filename ?? "d5879ded22a4b5e16270e53536124f9c";
    let role = req.body.role ?? 0;
    const uid = uuid();
    const result = await authQuery.signupPostQuery(uid, req.body.name, req.body.username, req.body.password, file, 0 , req.body.address, req.body.phone, role);
    const param = jwt.sign({ userid: uid }, process.env.verifyJWT , {expiresIn: '1h'})
    const link = `http://localhost:3000/login?id=${param}`
                    
    nodemailer.sendMail(req.body.username, link);
    res.redirect("/login");
    
   } catch (error) {
     res.render("signup.ejs", { cookie: null, name: "guest" })
     console.log(error);
   }
}

module.exports.loginPost = async (req, res) => {
    try {
        const result = await authQuery.loginPostQuery(req.body.username);
        if(!result){
            return res.status(401).json({error: "Invalid Username!"});
        }
        if(req.body.password === result.password){
            if(result.verifiedemail === 1) {
                const token = jwt.sign({ userid: result.username }, process.env.userJWT , { expiresIn: Math.floor(Date.now() / 1000) + 3600 });
                res.cookie("jwt", token, { httpOnly: true, expires: new Date(Date.now() + 3600000) });
                res.status(201).json({ user: result.username });
            } else {
                res.status(403).json({error: "Please Verify Your Email ID."});
            }
            } else {
                res.status(401).json({error: "Wrong Password!"});
            }
        
    } catch (error) {
        console.log(error.message);
        res.json({ error: error.message });
    }
};

module.exports.userhomeGet = async (req, res) => {
    try {
        let user = jwt.decode(req.cookies.jwt);
        const result = await authQuery.userhomeGetQuery(user.userid);
        res.render('userhome.ejs', {cookie: 1, admin: 1, name: user.userid, product: result.product, photo: result.user.profile});
    } catch (error) {
        console.log(error);
    }
}

module.exports.forgotPasswordGet = (req, res) => {
    try {
        res.render('forgotpassword', { cookie: null, name: "guest" });
    } catch (error) {
        console.log(error);
    }
}

module.exports.forgotPasswordPost = async (req, res) => {
    try {
        const result = await authQuery.forgotPasswordPostQuery(req.body.email);
        if(result !== "ok" ){
            res.json({msg: result});
        } else {
            const emailtoken = jwt.sign({ email: req.body.email }, process.env.verifyJWT, {expiresIn: '1h'})
        
            const link = `http://localhost:3000/changepassword?email=${emailtoken}`        
            const x = await nodemailer.sendMail(req.body.email,link)
            if(x === 1){
                res.json( { msg: "check your email for password changing link" } );
            } else {
                res.json( {msg: "there is some error while verifying the email please check your mail or reverify it"} )
            }
        }   
    } catch (error) {
        console.log(error);
        res.json( { msg: "internal server error please reload" });
        
    }
}

module.exports.changePasswordGet = (req, res) => {
    try {
        if(req.cookies.jwt){
            jwt.verify(req.cookies.jwt, process.env.userJWT , (err, decodedtoken) => {
                if(err){
                    console.log(err.message);
                    res.redirect('/login')
                } else {
                    res.render('changepassword.ejs', { cookie: null, name: "guest" , username: decodedtoken.userid}); 
                }
            })
        } else {
            jwt.verify(req.query.email, process.env.verifyJWT , (err, decodedtoken) => {
                if(err){
                    res.redirect('/forgotpassword');
                } else {    
                    res.render('changepassword.ejs', { cookie: null, name: "guest" , username: decodedtoken.email});
                }
            })
        } 
    } catch (error) {
        console.log(error, 'hello');
        res.redirect('/login');
    }
}

module.exports.changePasswordPost = async (req, res) => {
    let user;
    if(req.cookies.jwt){
        user = jwt.decode(req.cookies.jwt)
    } else {
        user = req.body.username;
    }
    const result = await authQuery.changePasswordPostQuery(req.body.new, user.userid);
    res.redirect("/login");
}

module.exports.logoutGet = async(req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("admin");
    res.redirect("/");
}



