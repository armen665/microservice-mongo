const express = require('express');
const jwt = require('jsonwebtoken');
const createSchemas = require('users-messages-schemas12');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const {User} = createSchemas(process.env.MONGO_DB_URL);

const authRouter = express.Router();

function signIn(req, res, next) {
    const { username, password } = req.body;
    User.find({username:username, password:password}, (err, data) => {
        if(err) {
            console.log('something went wrong with signin');
            return res.status(500).json('Something went wrong')
        }
        if(data.length > 0) {
            const accessToken = jwt.sign({ username }, accessTokenSecret);
            res.status(200).json({ accessToken, username });
        } else {
            res.status(403).json('Username or password are incorrect')
        }
    })
}

function signUp(req, res, next) {
    const { username } = req.body;

    User.findOne({username:username}, (err, data) => {
        if(err) {
            return res.status(500).json('Something went wrong')
        }
        if(data.length === 0) {
            console.log("user created successfully");
        } else {
            res.status(403).json('Username already exists')
        }
    })

}

authRouter
    .post('/signin', signIn)
    .post('/signup', signUp);

module.exports = authRouter;