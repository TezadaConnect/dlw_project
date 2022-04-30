const express = require("express");
const {
  deleteUser,
  addUser,
  updateUser,
  updatePassword,
} = require("../auth/admin_auth");
const router = express.Router();

router.post("/delete-user", deleteUser);

router.post("/add-user", addUser);

router.post("/update-user", updateUser);

router.post("/reset-password", updatePassword);

module.exports = router;
