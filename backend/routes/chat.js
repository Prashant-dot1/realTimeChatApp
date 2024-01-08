const {Router} = require("express");
const router = Router();

const {userMiddleware} = require("../middlewares/user");
const {accessChats , fetchAllChats , createGroup , renameGroup , addToGroup , removeFromGroup} = require("../controllers/chat");

router.post("/" , userMiddleware , accessChats);
router.get("/" , userMiddleware , fetchAllChats);
router.post('/group', userMiddleware, createGroup);
router.patch('/group/rename', userMiddleware, renameGroup);
router.patch('/groupAdd', userMiddleware, addToGroup);
router.patch('/groupRemove', userMiddleware, removeFromGroup);

module.exports = router;
