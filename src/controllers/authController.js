const {
    registerService,
    loginService,
    logoutService,
} = require("../services/authService");
const { catchError } = require("../utils/catchError");
const CustomError = require("../utils/customErrorResponse");
const { OK, CREATED } = require("../utils/customSuccessResponse");

const register = catchError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new CustomError("Please enter password or email", 400);

    const data = await registerService({ email, password });

    return new CREATED("Created account success", data).send(res);
});

const login = catchError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new CustomError("Please enter password or email", 400);

    const data = await loginService({ email, password });

    return new CREATED("Created account success", data).send(res);
});

const logout = catchError(async (req, res, next) => {
    const dataAuthorization = req.headers["authorization"].split(" ");

    const accessToken = dataAuthorization[1];

    if (!accessToken) throw new CustomError("Please pass access token", 400);

    const data = await logoutService(accessToken);

    return new OK("Created account success", data).send(res);
});

module.exports = {
    register,
    login,
    logout,
};
