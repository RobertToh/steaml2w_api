const mongoose = require("mongoose");

let activitySchema = new mongoose.Schema({
    l2w: Number,
    log_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Activity", activitySchema);