const   mongoose = require("mongoose"),
        Activity = require("./models/activity"),
        User = require("./models/user"),
        scraper = require("./scraper.js");

mongoose.connect('mongodb://localhost:27017/steaml2w', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

