const { Router } = require("express");
const authcontroller = require('../controllers/authcontroller');
const middleware = require('../middleware/middleware')

const multer = require('multer');
const storage = multer.diskStorage( {
    destination: (req, file, cb) => {
        if(req.path === '/signup'){
            cb(null, 'uploads/profile')
        }

        else{
            cb(null, 'uploads')
        }
    }
} )

const upload = multer( {storage: storage} )

const router = Router();

router.route('/')
   .get(middleware.protectRoute,authcontroller.getHome)

router.route('/signup')
    .get(middleware.protectRoute,authcontroller.signupGet)
    .post(upload.single('profile'),authcontroller.signupPost)

router.route("/login")
    .get(middleware.protectRoute,authcontroller.loginGet)
    .post(authcontroller.loginPost)

router.route("/userhome")
    .get(middleware.requireAuth,authcontroller.userhomeGet)

router.route('/logout')
    .get(authcontroller.logoutGet);

router.route('/forgotpassword')
    .get(authcontroller.forgotPasswordGet)
    .post(authcontroller.forgotPasswordPost)

router.route('/changepassword')
    .get(authcontroller.changePasswordGet)
    .post(authcontroller.changePasswordPost)

module.exports = router