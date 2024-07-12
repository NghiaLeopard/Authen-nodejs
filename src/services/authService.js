const {
    generateToken,
    addTokenToBlackList,
    createResetToken,
    createHash,
    comparePassword,
} = require("../auth/authUtils");
const User = require("../models/userModel");
const CustomError = require("../utils/customErrorResponse");
const bcrypt = require("bcrypt");
const emailService = require("./emailService");
const { CONFIG_MESSAGE_ERRORS } = require("../configs");

const registerService = async ({ email, password }) => {
    const user = await User.findOne({ email }).lean();

    if (user) throw new CustomError("User is registered", 400);
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = User.create({ email, password: hashPassword });

    if (!newUser) throw new CustomError("Registered fail", 401);

    return newUser;
};

const loginService = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password").lean();

    if (!user) throw new CustomError("User is not registered", 404);

    const hasPassword = await comparePassword(password, user.password);

    if (!hasPassword) throw new CustomError("Password is false", 400);

    const accessToken = await generateToken(
        { id: user._id, permission: user?.role?.permission },
        process.env.ACCESS_KEY,
        process.env.ACCESS_EXPIRE
    );

    const refreshToken = await generateToken(
        { id: user._id, permission: user?.role?.permission },
        process.env.Refresh_KEY,
        process.env.Refresh_EXPIRE
    );

    if (accessToken && refreshToken) {
        user.password = undefined;
    }

    return {
        message: "Login success",
        metadata: {
            token: { accessToken, refreshToken },
            user: user,
        },
    };
};

const logoutService = async (accessToken) => {
    await addTokenToBlackList(accessToken);
    return {
        message: "Logout success",
        metadata: {
            user: null,
        },
    };
};

const forgotPasswordService = async (email) => {
    const user = await User.findOne({ email });

    if (!user) throw new CustomError("User is not registered", 404);

    const { token, resetToken, resetTokenExpires } = createResetToken();

    await user.updateOne({
        $set: { resetToken, resetTokenExpired: resetTokenExpires },
    });

    const resetLink = `http://localhost:3000/reset-password?secretKey=${token}`;

    emailService(user.email, resetLink);

    return {
        message: "Success",
    };
};

const resetPasswordService = async ({ secretKey, newPassword }) => {
    const resetToken = createHash(secretKey);

    const user = await User.findOne({
        resetToken,
        resetTokenExpired: { $gt: Date.now() },
    });

    if (!user) throw new CustomError("Secret token is expired");

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpired = undefined;
    user.save();

    return {
        message: "Success",
    };
};

const changePasswordService = async ({
    accountId,
    newPassword,
    currentPassword,
}) => {
    const user = await User.findOne({
        _id: accountId,
    }).select("+password");

    if (!user)
        throw new CustomError(
            "User is not exist",
            CONFIG_MESSAGE_ERRORS.INVALID.status
        );

    const compareCurrentPassword = await comparePassword(
        currentPassword,
        user.password
    );

    if (!compareCurrentPassword)
        throw new CustomError(
            "Current password is false",
            CONFIG_MESSAGE_ERRORS.INVALID.status
        );

    const compareNewPassword = await comparePassword(
        newPassword,
        user.password
    );

    if (compareNewPassword)
        throw new CustomError(
            "New password is similar current password ",
            CONFIG_MESSAGE_ERRORS.INVALID.status
        );

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;
    user.save();

    return {
        message: "Success",
    };
};

module.exports = {
    registerService,
    loginService,
    logoutService,
    forgotPasswordService,
    resetPasswordService,
    changePasswordService,
};
