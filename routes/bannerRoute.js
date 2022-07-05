
const express = require("express")
const { requireSignIn, checkAdmin } = require("../controllers/authController")
const { getBanner ,createBanner} = require("../controllers/bannerController")
const router = express.Router()


router.post("/v1/create-banner", requireSignIn,checkAdmin, createBanner)
router.get("/v1/get-banner", requireSignIn, getBanner)


module.exports = router