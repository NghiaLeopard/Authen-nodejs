const { generateToken, addTokenToBlackList } = require("../auth/authUtils");
const User = require("../models/userModel");
const CustomError = require("../utils/customErrorResponse");
const bcrypt = require("bcrypt");

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

    const hasPassword = bcrypt.compare(password, user.password);

    if (!hasPassword) throw new CustomError("Password is false", 400);

    const accessToken = await generateToken(
        { id: user._id, email: user.email },
        process.env.ACCESS_KEY,
        process.env.ACCESS_EXPIRE
    );

    const refreshToken = await generateToken(
        { id: user._id, email: user.email },
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

module.exports = {
    registerService,
    loginService,
    logoutService,
};
