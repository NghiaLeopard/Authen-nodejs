const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const app = require("./src/app");

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log("Welcome to server: " + PORT);
});
