import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ REGISTER FUNCTION
export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists, try a different one." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Profile Photo
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: {
                _id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                profilePhoto: newUser.profilePhoto,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Server error during registration." });
    }
};

// ✅ LOGIN FUNCTION
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Incorrect username or password" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect username or password" });
        }

        // Token Creation
        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        return res
            .status(200)
            .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
            .json({
                message: "Login successful.",
                success: true,
                token, // ✅ Sending token in response for frontend use
                user: {
                    _id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    profilePhoto: user.profilePhoto,
                },
            });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error during login." });
    }
};

// ✅ LOGOUT FUNCTION
export const logout = (req, res) => {
    try {
        return res
            .status(200)
            .cookie("token", "", { maxAge: 0 })
            .json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error during logout." });
    }
};

// ✅ DELETE ACCOUNT FUNCTION
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ GET OTHER USERS
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;

        if (!loggedInUserId) {
            return res.status(401).json({ message: "Unauthorized. No user ID found in request." });
        }

        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        return res.status(200).json({
            success: true,
            users: otherUsers,
        });
    } catch (error) {
        console.error("Fetch users error:", error);
        return res.status(500).json({ message: "Server error while fetching users." });
    }
};
