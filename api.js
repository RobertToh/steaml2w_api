const   mongoose = require("mongoose"),
        express = require("express"),
        app = express(),
        bodyParser = require("body-parser"),
        expressSanitizer = require('express-sanitizer');
        //schedule = require("./schedule.js"),
        //cron = require("node-cron");

//Routes
const   userRoutes = require("./routes/users.js");

//Setup DB connection
mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressSanitizer());

//Use Routes
app.use("/users/", userRoutes);

//cron.schedule("0 0 * * *", schedule.daily_check);

//Start Server
let port = process.env.PORT || 3000
app.listen(port, function () {
    let message = "Server started on port " + port;
    console.log(message);
})
