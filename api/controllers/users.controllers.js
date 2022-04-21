const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = mongoose.model(process.env.USER_MODEL);

addOne = (req, res) => {
    const response = {};

    if (req.body && req.body.username && req.body.password) {
        bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), (err, salt) => _checkForErrorCreateHashThenCreateUser(err, salt, response, req, res));
    } else {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INCORRECT_ADD_USER_PARAMETERS};
        _sendResponse(res, response);
    }
};

_checkForErrorCreateHashThenCreateUser = (err, salt, response, req, res) => {
    if (err) {
        response.status = process.env.INTERNAL_ERROR_STATUS_CODE;
        response.message = {error: err};
        _sendResponse(res, response);
    } else {
        const passwordString = req.body.password;
        const username = req.body.username;
        const name = req.body.name;
        
        bcrypt.hash(passwordString, salt, (err, passwordHash) => _checkForErrorAndCreateUser(err, passwordHash, username, name, response, res));
    }
};

_checkForErrorAndCreateUser = (err, passwordHash, username, name, response, res) => {
    if (err) {
        response.status = process.env.INTERNAL_ERROR_STATUS_CODE;
        response.message = {error: err};
        _sendResponse(res, response);
    } else {
        const newUser = {
            username: username,
            password: passwordHash,
            name: name
        };
        User.create(newUser)
            .then((user) => _onSuccessfulUserCreation(user, response))
            .catch((err) => _handleError(err, response))
            .finally(() => _sendResponse(res, response));
    }
};

_sendResponse = (res, response) => {
    res.status(response.status).json(response.message);
};

_onSuccessfulUserCreation = (message, response) => {
    response.status = process.env.USER_CREATED_STATUS_CODE;
    response.message = message;
};

_handleError = (error, response) => {
    response.status = process.env.INTERNAL_ERROR_STATUS_CODE;
    console.log(error);
    response.message = {error: error};
};

login = (req, res) => {
    const response = {};

    if (req.body && req.body.username && req.body.password) {
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({username: username}).exec()
            .then((user) => makeSingleUserCallback(user, password, res))
            .catch((err) => _handleError(err, response));
    } else {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INCORRECT_ADD_USER_PARAMETERS};
        _sendResponse(res, response);
    }
};

const makeSingleUserCallback = (user, password, res) => {
    const response = {};
    if (!user) {
        response.status = process.env.UNAUTHORIZED_STATUS_CODE;
        response.message = {message: process.env.INVALID_PASSWORD_USERNAME};
        _sendResponse(res, response);
    } else {
        bcrypt.compare(password, user.password)
            .then(isPasswordValid => _handleResultFromPasswordCompare(isPasswordValid, user, response))
            .catch((err) => _handleError(err, response))
            .finally(() => _sendResponse(res, response));
    }
}

_handleResultFromPasswordCompare = (isPasswordValid, user, response) => {
    if (isPasswordValid) {
        const token = jwt.sign({name: user.name}, process.env.JWT_PASSWORD, {expiresIn: parseInt(process.env.TOKEN_EXPIRATION_TIME)});
        response.status = process.env.SUCCESS_RESPONSE_STATUS_CODE;
        response.message = {
            message: 'success',
            token: token
        };
    } else {
        response.status = process.env.UNAUTHORIZED_STATUS_CODE;
        response.message = {message: process.env.INVALID_PASSWORD_USERNAME};
    }
};


module.exports = {
    addOne,
    login
}
