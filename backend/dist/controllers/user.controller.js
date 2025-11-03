import bcrypt from "bcryptjs";
import User from "../models/user.model";
export const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "user already exist" });
        }
        const hashedPassword = bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password });
        return res
            .status(201)
            .json({ success: true, message: "user created successfully", user });
    }
    catch (error) {
        console.log("Error in registerUser: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
