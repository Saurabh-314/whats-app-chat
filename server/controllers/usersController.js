const User = require("../models/userModel");
const Messages = require("../models/messageModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // const usernameCheck = await User.findOne({ username });

        // if (usernameCheck)
            // return res.json({ msg: "Username already used", status: false });

        const emailCheck = await User.findOne({ email });
        if (emailCheck)
            return res.json({ msg: "Email already used", status: false });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            email,
            username,
            password: hashedPassword
        });
        delete user.password;
        const userInfo = {
            user: user.username,
            id: user._id,
        }
        return res.json({
            status: true,
            user: userInfo
        })
        
    } catch (err) {
        next(err)
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.json({ msg: "Incorrect username or password", status: false });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.json({ msg: "Incorrect username or password", status: false });

        delete user.password;
        const userInfo = {
            user: user.username,
            id: user._id,
        }
        return res.json({
            status: true,
            user: userInfo
        })
    } catch (err) {
        next(err)
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email", "username", "_id",
        ])
        return res.json({ users })
    } catch (ex) {
        next(ex);
    }
}

module.exports.addMessage = async (req, res, next) => {
    try {
        const data = await Messages.create(req.body)
        if (data) return res.json({ msg: "messages added successfully" })
        return res.json({ msg: "faild to add message" })
    } catch (ex) {
        next(ex);
    }
}

module.exports.getMessage = async (req, res, next) => {
    try {
        const message = await Messages.find();
        return res.json({ message })
    } catch (error) {
        next(error)
    }
}