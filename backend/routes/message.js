const {Router} = require("express");
const router = Router();

const {userMiddleware} = require("../middlewares/user");
const {sendMessage , getMessage} = require("../controllers/message");

//routes
router.post("/",userMiddleware , sendMessage);

router.get("/:chatId" , userMiddleware , getMessage);

module.exports = router;