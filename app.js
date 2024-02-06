const express = require("express");
const authRoutes = require('./routes/authRoutes');
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const connection = require('./model/mysqldb');
const sellerRoutes = require('./routes/sellerRoutes');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT;


// app.use((req,res,next)=>{
//     console.log(req.method,'---',req.url);
//     // console.log(req.body);
    
//     next();
// })

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use(express.static('uploads/'));
app.use(express.static('uploads/profile/'));
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())



app.set("view engine", "ejs")



// connecting to mysql
connection.connect((err) => {
    if (err) {
        console.log(err);
    }

    else{
        console.log(`Connected to MySQL`);
        app.listen(PORT, () => {
            console.log('server started at', PORT);
        })
    }
})


// connecting to database
// const dbURL = "mongodb://localhost/ecomm";
// mongooose.connect(dbURL)
// .then((result) => app.listen(PORT,()=>console.log('server started at port',PORT)))
// .catch((err) => console.log(err));



app.use("/",authRoutes);
app.use("/user",userRoutes);
app.use('/cart',cartRoutes);
app.use("/admin",adminRoutes);
app.use("/seller",sellerRoutes);


app.use("*", (req, res) => {
    try {
        connection.query( "SELECT * FROM product LIMIT 5", (error, result, field) => {
                res.render('home.ejs', {cookie: null, admin: 1, name: "guest", product: result})
           })
    } catch (error) {
        console.log(error);
    }
})


