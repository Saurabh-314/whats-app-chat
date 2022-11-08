const { register, login, getAllUsers, addMessage, getMessage } = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/allusers/:id", getAllUsers);

router.post("/addmsg", addMessage);
router.get("/getmsg", getMessage);

module.exports = router;