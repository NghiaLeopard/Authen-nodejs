const { Schema, model } = require("mongoose");
const COLLECTION_NAME = "Users";
const DOCUMENT_NAME = "User";

const userSchema = new Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        middleName: { type: String },
        avatar: { type: String },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            minLength: 8,
            select: false,
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Please enter your email"],
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
        },
        city: {
            type: Schema.Types.ObjectId,
            ref: "City",
        },
        status: {
            type: Number,
            enum: [0, 1],
            default: 1,
        },
        phoneNumber: {
            type: Number,
            min: [9, "please enter greater than 8 number"],
            max: [10, "please enter less than 11 number"],
        },
        likeProducts: {
            type: [Schema.Types.ObjectId],
            default: [],
        },
        userType: {
            type: Number,
            default: 3,
            enum: [1, 2, 3],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

userSchema.post("save", function (docs, next) {
    docs.password = undefined;
    next();
});

const User = model(DOCUMENT_NAME, userSchema);

module.exports = User;
