const fs = require("fs");
const JWT = require("jsonwebtoken");

const generateToken = async (payload, key, expire) => {
    const token = await JWT.sign(payload, key, {
        expiresIn: expire,
    });

    return token;
};

const getBlackList = async () => {
    return await fs.promises.readFile(`./blacklist.json`, "utf-8");
};

const addTokenToBlackList = async (accessToken) => {
    const blacklist = await getBlackList();
    const parseData = JSON.parse(blacklist);
    parseData.push(accessToken);

    await fs.promises.writeFile("blacklist.json", JSON.stringify(parseData));
};

module.exports = { generateToken, addTokenToBlackList };
