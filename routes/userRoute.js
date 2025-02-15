import express from "express";
import { getOtherUsers, login, logout, register, deleteUser } from "../controllers/userControllers.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get((req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
});
router.route("/all-users").get(isAuthenticated, getOtherUsers);
router.route("/delete/:id").delete(isAuthenticated, deleteUser); // ✅ DELETE ACCOUNT ROUTE

export default router;
