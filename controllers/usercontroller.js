const jwt = require("jsonwebtoken");
const userQuery=require('../model/userQuery');


module.exports.getProductDetail = async (req, res) => {
    try { 
        const result = await userQuery.getProductDetailQuery(req.body.productid);
        if(!result){    
            return res.status(404).json( { error: "Product not found" } ) 
        }
        res.json(result);       
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'error fetching product' });
    }
}

module.exports.addToCart = async (req, res) => {
    try {
            const user = jwt.decode(req.cookies.jwt);
            const result = await userQuery.addToCartQuery(user.userid, req.body.id);
            console.log(result);
            if(result){
                res.end();
            } else {
                res.end();
            }
  
    } catch (error) {
        console.log(error);
    } 
}

module.exports.cartGet = async (req, res) => {
    try {
        const user = jwt.decode(req.cookies.jwt);
        const result = await userQuery.cartGetQuery(user.userid);
        var total = 0;
        result.product.forEach(element => {
            total = total + parseFloat(element.QUANTITY * parseFloat(element.PRICE)); 
        });
        let bill = total.toFixed(2);
        res.render('cart.ejs', {cookie: 1, admin: 1, name: user.userid, photo: result.user.profile, cart_product: result.product, b: bill});   
    } catch (error) {
        console.log(error)
        res.end("404 not found!!");
    }   
}

module.exports.nextPage = async (req, res) => {
    let page = req.query;
    let offset = (page.page - 1) * page.totalelement;
    let limit = parseInt(page?.limit) || 5;
    const queryRes = await userQuery.nextPageQuery(1, limit, offset );
    res.status(200).json(queryRes);
}

module.exports.previousPage = async (req, res) => {
    let page = req.query;
    let offset = (page.page - 1) * page.totalelement ;
    let limit = ParseInt(page?.limit) || 5;
    const queryRes = await userQuery.previousPageQuery(1, limit, offset);
    res.status(304).json(queryRes);
}

