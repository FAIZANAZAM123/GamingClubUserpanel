const express = require('express');
const router = express.Router();

const UserController = require('../Controllers/UserController');
const authenticate = require('../Middleware/authenticate');


router.post("/register", UserController.register);
router.post("/signin", UserController.signIn);

router.get("/getall", UserController.getall);

router.get("/getallusers", UserController.getallusers);




router.get("/logout", authenticate, UserController.logout);


module.exports = router;