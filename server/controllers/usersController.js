const User = require("../models/userModel");
const Messages = require("../models/messageModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    // console.log("register ", req.body);
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });

        if (usernameCheck)
            return res.json({ msg: "Username already used", status: false });

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
        return res.json({ status: true, user })
    } catch (err) {
        next(err)
    }
};

module.exports.login = async (req, res, next) => {
    // console.log("login ", req.body);
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
        // console.log("getAllUsers ", users);
        return res.json({ users })
        // const userInfo = {
        //     user: users.username,
        //     id: users._id,
        // }
        // return res.json({
        //     status: true,
        //     user: userInfo
        // })
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
    // const from = req.query.from;
    // const to = req.query.to;
    // console.log("from", from)
    // console.log("to", to)  
    // db.inventory.find( { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] } )
    try {
        const message = await Messages.find();
        // const message = await Messages.find({ to, from });
        console.log("message", message);
        return res.json({ message })
    } catch (error) {
        next(error)
    }
}