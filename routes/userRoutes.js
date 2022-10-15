const express = require("express");
const router = express.Router();
const {
  showCurrentUser,
  updateUser,
  updatePassword,
} = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authentication");

router.route("/showCurrentUser").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updatePassword").patch(authenticateUser, updatePassword);

module.exports = router;
