const   mongoose = require("mongoose"),
        express = require("express"),
        app = express(),
        bodyParser = require("body-parser"),
        expressSanitizer = require('express-sanitizer');

//Routes
const   userRoutes = require("./routes/users.js");

//Setup DB connection
mongoose.connect('mongodb://localhost:27017/steaml2w', {
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


//Start Server
app.listen(3000, function () {
    console.log("Server started on port 3000");
})
