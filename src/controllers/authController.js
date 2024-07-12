const authService = require("../services/authService");
const { catchError } = require("../utils/catchError");
const CustomError = require("../utils/customErrorResponse");
const { OK, CREATED } = require("../utils/customSuccessResponse");

const register = catchError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new CustomError("Please enter password or email", 400);

    const data = await authService.registerService({ email, password });

    return new CREATED("Created account success", data).send(res);
});

const login = catchError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new CustomError("Please enter password or email", 400);

    const data = await authService.loginService({ email, password });

    return new CREATED("Created account success", data).send(res);
});

const logout = catchError(async (req, res, next) => {
    const dataAuthorization = req.headers["authorization"].split(" ");

    const accessToken = dataAuthorization[1];

    if (!accessToken) throw new CustomError("Please pass access token", 400);

    const data = await authService.logoutService(accessToken);

    return new OK("Created account success", data).send(res);
});

const forgotPassword = catchError(async (req, res, next) => {
    const { email } = req.body;
    if (!email) throw new CustomError("Please enter email", 400);

    const data = await authService.forgotPasswordService(email);

    return new OK("Created account success", data).send(res);
});

const resetPassword = catchError(async (req, res, next) => {
    const { secretKey, newPassword } = req.body;

    if (!secretKey || !newPassword)
        throw new CustomError("Please enter new password or secret key", 400);

    const data = await authService.resetPasswordService({
        secretKey,
        newPassword,
    });

    return new OK("Created account success", data).send(res);
});

const changePassword = catchError(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const accountId = req.userId;

    if (!newPassword || !currentPassword)
        throw new CustomError("Please enter new password or secret key", 400);

    const data = await authService.changePasswordService({
        accountId,
        newPassword,
        currentPassword,
    });

    return new OK("Created account success", data).send(res);
});

module.exports = {
    logout,
    login,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
};
