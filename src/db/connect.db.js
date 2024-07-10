"use strict";

const mongoose = require("mongoose");

const DATABASE = process.env.DATABASE_STR;

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose
            .connect(DATABASE, {
                maxPoolSize: 50,
            })
            .then(() => {
                console.log("Connect db success");
            })
            .catch((err) => {
                console.log("Connect db fail: ", err);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
    }
}

module.exports = Database.getInstance();
