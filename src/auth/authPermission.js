const User = require("../models/userModel");
const CustomError = require("../utils/customErrorResponse");
const JWT = require("jsonwebtoken");
const { checkTokenBlackList } = require("./authUtils");
const { CONFIG_PERMISSIONS, CONFIG_MESSAGE_ERRORS } = require("../configs");

const authPermission = (permission, isAuthMe, isPublic) => (req, res, next) => {
    const authorization = req.headers["authorization"].split(" ");
    const accessToken = authorization[1];

    if (!accessToken)
        next(
            new CustomError(
                CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
                CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status
            )
        );

    if (checkTokenBlackList(accessToken))
        next(new CustomError("token is forbidden", 403));

    JWT.verify(accessToken, process.env.ACCESS_KEY, async (err, user) => {
        if (err)
            new CustomError(
                CONFIG_MESSAGE_ERRORS.INVALID.type,
                CONFIG_MESSAGE_ERRORS.INVALID.status
            );

        const { id, permissions, exp } = user;

        const account = await User.findOne({ _id: id });

        if (!account)
            next(
                new CustomError(
                    CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
                    CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status
                )
            );

        req.userId = id;

        if (
            permissions?.includes(permission) ||
            permissions?.includes(CONFIG_PERMISSIONS.ADMIN) ||
            isAuthMe
        ) {
            next();
        } else if (isPublic) {
            next();
        } else
            next(
                new CustomError(
                    CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.type,
                    CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status
                )
            );
    });
};

module.exports = authPermission;
