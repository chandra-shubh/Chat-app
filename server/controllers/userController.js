const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');

module.exports.register = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await Users.findOne({ username });//check if username present true/false
        if (usernameCheck)
            return res.json({ message: "USERNAME ALREADY USED", success: false });

        const emailCheck = await Users.findOne({ email });
        if (emailCheck)
            return res.json({ message: "EMAIL ALREADY USED", success: false });
        const hashedpassword = await bcrypt.hash(password, 10);//10  is type of encryption

        const user = await Users.create({
            email,
            username,
            password: hashedpassword,
        });
        delete user.password//donot need password
        return res.json({ status: true, user });
    } catch (err) {
        return res.json({ message: err, success: false });
    }
};




module.exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() });
    }
    try {
        const { username, password } = req.body;

        console.log("login hua");

        const user = await Users.findOne({ username });//check if username present true/false
        if (!user)
            return res.json({ msg: "INCORRECT USERNAME OR PASSWORD", status: false });

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck)
            return res.json({ msg: "INCORRECT USERNAME OR PASSWORD", status: false });
        delete user.password;


        return res.json({ status: true, user });
    } catch (err) {
        return res.json({ message: err, status: false });
    }
};

module.exports.setAvatar = async (req, res, next) => {

    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await Users.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        })
        return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
    } catch (ex) {
        next(ex);//pass exception to next expree will automatically handle it
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
       
        
        const users = await Users.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);

        return res.json(users);

    } catch (error) {
        next(error);
    }
}