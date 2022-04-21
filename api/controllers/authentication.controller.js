const jwt = require('jsonwebtoken');
const util = require('util');

const jwtVerifyPromise = util.promisify(jwt.verify);

authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const response = {
        status: 403,
        message: {message: process.env.NO_TOKEN_PROVIDED}
    };
    if (authHeader) {
        // We should have a Bearer keyword in the token
        const token = authHeader.split(" ")[1];
        jwtVerifyPromise(token, process.env.JWT_PASSWORD)
            .then(result => {
                next();
            })
            .catch(err => {
                _invalidAuthToken(err, res, response);
            });
    } else {
        _sendResponse(res, response);
    }
};

_invalidAuthToken = (error, res, response) => {
    response.status = 401;
    response.message = {message: process.env.INVALID_TOKEN_PROVIDED};
    _sendResponse(res, response)
}

_sendResponse = (res, response) => {
    res.status(response.status).json(response.message);
};

module.exports = {
    authenticate
}
