const fs = require("fs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const generateToken = async (payload, key, expire) => {
    const token = await JWT.sign(payload, key, {
        expiresIn: expire,
    });

    return token;
};

const createHash = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

const comparePassword = async (password, passwordUser) => {
    return bcrypt.compare(password, passwordUser);
};

const createResetToken = function () {
    const token = crypto.randomBytes(32).toString("hex");

    const resetToken = createHash(token);

    const resetTokenExpires = Date.now() + 10 * 60 * 1000;

    return { token, resetToken, resetTokenExpires };
};

const getBlackList = () => {
    try {
        const data = fs.readFileSync(`./blacklist.json`, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const addTokenToBlackList = async (accessToken) => {
    const blacklist = getBlackList();

    blacklist.push(accessToken);

    await fs.promises.writeFile("blacklist.json", JSON.stringify(blacklist));
};

const checkTokenBlackList = (accessToken) => {
    const blacklist = getBlackList();

    return blacklist.some((item) => item === accessToken);
};

module.exports = {
    generateToken,
    addTokenToBlackList,
    checkTokenBlackList,
    createResetToken,
    createHash,
    comparePassword,
};
