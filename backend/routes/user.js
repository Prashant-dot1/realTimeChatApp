const {Router} = require("express");
const { userMiddleware } = require("../middlewares/user");
const {registerUser , loginUser , validUser} = require("../controllers/user");
const router = Router();

//user register
router.post("/auth/register",registerUser);
//user login
router.post("/auth/login",loginUser);
//user logout
// router.get("/auth/logout",userMiddleware,logoutUser);
// valid User
router.get("/auth/valid", userMiddleware , validUser);


module.exports = router;