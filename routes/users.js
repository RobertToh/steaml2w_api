const   express = require("express"),
        router = express.Router(),
        Activity = require("../models/activity"),
        User = require("../models/user")
        scraper = require("../scraper.js");


//Show Route
router.get("/:steam_id", function(req, res){ 
    let steam_id = req.params.steam_id;
    User.findOne({ steamID: steam_id }).populate("hours").exec(function (err, user) {
        if (err) {
            res.status(500);
            res.json({error: err});
        }
        else {
            if (user == null) {
                res.json([]);
            }
            else {
                res.json(user.hours);
            }
            
        }
    })
});


//Create Route
router.post("/", function(req,res) {
    if (req.body.steamID) {
        let steam_ID = req.sanitize(req.body.steamID);
        
        User.create({
            steamID: steam_ID   
        }, 
        function(err, user){
            if (err) {
                res.status(500);
                res.json({ error: err });
            }
            else {
                scraper.getProfileHours("https://steamcommunity.com/profiles/" + steam_ID).then(function(result){
                    if (result == -1) {
                        //Delete created user from db
                        User.deleteOne({steamID: steam_ID}, function(err){
                            if (err) {
                                res.status(500);
                                res.json({ error: err });
                            }
                            else {
                                res.json([]);
                            }
                        });
                    }
                    else {
                        Activity.create({
                            l2w: result
                        },
                        function (err, activity) {
                            if (err) {
                                res.status(500);
                                res.json({ error: err });
                            }
                            else {
                                user.hours.push(activity);
                                user.save();
                                res.json(user.hours);
                            }
                        });
                    }    
                });
            }
        });

    }
});



module.exports = router;