const jwt = require("jsonwebtoken");
const adminQuery = require('../model/adminQuery');

module.exports.adminloginGet = (req,res) => {
    try {
        if(req.cookies.admin){
            res.redirect("/admin/adminhome")
        }
        else{
            res.render('adminlogin.ejs', { cookie: null, name: "guest", error: "" })
        }  
    } catch (error) {
        console.log(error);    
    }
}

module.exports.adminloginPost = async(req, res) => {
    try {
        const result = await adminQuery.adminloginPostQuery(req.body.username);
        if(result.length !== 0) {
            if(result[0].password === req.body.password){
                const admintoken = jwt.sign({ username: req.body.username }, process.env.adminJWT , { expiresIn: Math.floor(Date.now() / 1000) + 3600 })
                res.cookie("admin", admintoken, { httpOnly: true, expires: new Date(Date.now() + 3600000) });
                res.status(201).json({ user: result[0].username });
              } else {
                res.json( { error: "Incorrect Password" } );
              }
          } else {
            return res.status(401).json( { error: "Invalid username" }); 
          } 
    } catch (error) {
        console.log(error);
        res.json( { error: error.message } );
        
    }
}

module.exports.adminHomeGet = async(req, res) => {
    try {
        const result = await adminQuery.adminHomeGetQuery();
        res.render("adminhome", { cookie: 1, admin: 0, name: "admin", photo: "d5879ded22a4b5e16270e53536124f9c", Product: result })  
    } catch (error) {
        console.log(error);   
    }
}

module.exports.moveRight = async (req, res) =>{
    try { 
        let offset = (req.query.offset - 1) * 5;
        const result = await adminQuery.moveRightQuery(offset);
        if(result == null){
            res.json( { product: null }); 
        } else {
            res.json( { product: result } ); 
        }    
    } catch (error) {
        console.log(error);
        res.json( { product: null } );
    } 
}

module.exports.moveLeft = async (req, res) => {
    try { 
        let offset = (req.query.offset - 1) * 5;
        const result = await adminQuery.moveLeftQuery(offset);
        if(result == null){
            res.json( { product: null }); 
        } else {
            res.json( { product: result } ); 
        }    
    } catch (error) {
        console.log(error);
        res.json( { product: null } );
    } 
}

module.exports.approveProductDetails = async (req, res) => {
    let offset = (req.body.offset - 1) * 5;
    const result = await adminQuery.approveProductQuery(req.body.id, offset);
    res.json({ product: result });
}


module.exports.deleteProduct = async (req, res) => {
   let offset = (req.body.offset - 1) * 5;
   const result = await adminQuery.deleteProductQuery(req.body.id, offset);
   res.json({product: result});
}

module.exports.addProduct = async(req, res) => {
    try {
        if(req.file.size >= 256000){
            res.json("file size limit exceeds");
        } else {
            const result = await adminQuery.addProductQuery(req.file.filename, req.body.name, req.body.description, req.body.price, req.body.quantity);
            if(result){
                res.json("data added successfully");
            } else {
                res.json("there is some error uploading the data");
            }
        }  
    } catch (error) {
        console.log(error);
    }
    
};


module.exports.viewproducts = async(req, res) => {
    try {
        const result = await adminQuery.viewProductsQuery();
        res.render("adminallprod", { cookie: 1, admin: 0, name: "admin", photo: "d5879ded22a4b5e16270e53536124f9c", Product: result }) 
    } catch (error) {
        console.log(error);   
    }
}

module.exports.deleteProd = async (req, res) => {
    const result = await adminQuery.deleteProdQuery(req.body.id, req.body.limit);
    res.json({ product: result });
}
