const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");
const { errorHandler } = require("../auth");

// POST /users/register
module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")) {
        return res.status(400).send({ error: "Email invalid" });
    } else if (req.body.password.length < 8) {
        return res.status(400).send({ error: "Password must be at least 8 characters" });
    } else {

        let newUser = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return newUser.save()
            .then((user) => res.status(201).send({ message: "Registered Successfully" }))
            .catch(err => errorHandler(err, req, res));
    }

};

// POST /users/login
module.exports.loginUser = (req, res) => {

    if (req.body.email.includes("@")) {
        return User.findOne({ email: req.body.email })
            .then(result => {

                if (result == null) {
                    return res.status(404).send({ error: "No Email Found" });
                } else {

                    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                    if (isPasswordCorrect) {
                        return res.status(200).send({ access: auth.createAccessToken(result) });
                    } else {
                        return res.status(401).send({ error: "Email and password do not match" });
                    }

                }

            })
            .catch(err => errorHandler(err, req, res));
    } else {
        return res.status(400).send({ error: "Invalid email format" });
    }

};

// GET /users/details
module.exports.getUserDetails = (req, res) => {

    return User.findById(req.user.id)
        .then(user => {

            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }

            user.password = undefined;
            return res.status(200).send({ user });

        })
        .catch(err => errorHandler(err, req, res));

};