const mongoose = require("mongoose");

let activitySchema = new mongoose.Schema({
    l2w: Number,
    log_date: {type: Date, default: Date.now},
    games: [{
        appid: Number,
        name: String,
        playtime_2weeks: Number,
        img_logo_url: String
    }]
});

module.exports = mongoose.model("Activity", activitySchema);