const express = require("express");
const router = express.Router();

const upload_files = require("../middleware/upload_files");
const check_auth = require("../middleware/check_auth");

const User = require("./user_routes");
const dashboard = require("./dashboard");
const project = require("./project");

router.get("/adobe_api_key", (req, res, next)=>{
    const api_key = process.env.ADOBE_API_KEY || "a9362a167fd147fa94dc1d82438a26a4";
    res.status(200).json({
        key: api_key
    })
});

router.get("/load_data", check_auth, dashboard.load_data);
router.post("/InsertData", check_auth, upload_files, dashboard.new_chapter);
router.post("/fetch_config", check_auth, project.fetch_config);
router.post("/update_config", check_auth, project.update_config);
router.post("/signup", User.signup);
router.post("/login", User.login);
router.post("/Add_Answer", check_auth, dashboard.update_answer);
router.post("/save_result", check_auth, project.save_result);
router.post("/fetch_result", check_auth, project.fetch_result);
router.post("/clear_result", check_auth, project.clear_result);
router.get("/refresh_token", User.refresh_token);

module.exports = router;