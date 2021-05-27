const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    steamID: {type: String, unique: true},
    hours: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity"
    }]
});

module.exports = mongoose.model("User", userSchema);