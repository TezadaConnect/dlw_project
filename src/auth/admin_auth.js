const {
  ADMIN_AUTH,
  ADMIN_FIRESTORE,
} = require("../config/firebase_admin_config");

exports.deleteUser = (req, res) => {
  const { userId } = req.body;
  try {
    ADMIN_FIRESTORE.collection("users").doc(userId).delete();
    ADMIN_AUTH.deleteUser(userId);
    return res.status(200).json({
      status: "200",
      message: "User: " + JSON.stringify(userId) + " successfully deleted",
    });
  } catch (error) {
    throw error;
  }
};

exports.addUser = (req, res) => {
  const { password, fname, lname, email, role } = req.body;
  try {
    const user_fname = (fname.charAt(0).toUpperCase() + fname.slice(1)).trim();
    const user_lname = (lname.charAt(0).toUpperCase() + lname.slice(1)).trim();
    ADMIN_AUTH.createUser({
      email: email,
      password: password,
      displayName: user_fname + " " + user_lname,
    }).then((user) => {
      ADMIN_FIRESTORE.collection("users").doc(user.uid).set({
        email: email,
        fname: user_fname,
        lname: user_lname,
        role: role,
        terms: true,
      });
    });
    res.status(200).json({
      status: "200",
      message: "User successfully added",
    });
  } catch (error) {
    throw error;
  }
};

exports.updateUser = (req, res) => {
  const { fname, lname, email, role, userId } = req.body;
  try {
    const user_fname = (fname.charAt(0).toUpperCase() + fname.slice(1)).trim();
    const user_lname = (lname.charAt(0).toUpperCase() + lname.slice(1)).trim();
    ADMIN_AUTH.updateUser(userId, {
      email: email,
      displayName: user_fname + " " + user_lname,
    }).then((user) => {
      ADMIN_FIRESTORE.collection("users").doc(user.uid).update({
        email: email,
        fname: user_fname,
        lname: user_lname,
        role: role,
      });
    });
    return res.status(200).json({
      status: "200",
      message: "User successfully updated",
    });
  } catch (error) {
    throw error;
  }
};

exports.updatePassword = (req, res) => {
  const { password, userId } = req.body;
  try {
    ADMIN_AUTH.updateUser(userId, {
      password: password,
    });
    return res.status(200).json({
      status: "200",
      message: "Updated updated",
    });
  } catch (error) {
    throw error;
  }
};
