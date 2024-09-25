const express = require("express");
const router = express.Router();

const {userSignIn, userLogin} = require("../controllers/UserSignIn")

router.post("/", userSignIn);;

router.post("/login", userLogin);