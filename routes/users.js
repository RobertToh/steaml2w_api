const   express = require("express"),
        router = express.Router(),
        Activity = require("../models/activity"),
        User = require("../models/user")
        scraper = require("../scraper.js");


//Show Route
router.get("/:steam_id", function(req, res){ 
    let steam_id = req.sanitize(req.params.steam_id);
    User.findOne({ steamID: steam_id })
        .populate({
            path: "hours", 
            select: "l2w log_date -_id",
            options: {limit: 365, sort: {log_date: -1}}
        })
        .exec(function (err, user) {
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
        });
});


//Create Route
router.post("/", async function(req,res) {
    if (req.body.steamID) {
        let steam_ID = req.sanitize(req.body.steamID);
        
        try {
            let valid = false;
            let result = await scraper.getProfileHours("https://steamcommunity.com/profiles/" + steam_ID);
            if (result == -1){
                //Profile link is not valid, or profile is private
                valid = false;

                result = await scraper.getProfileHours("https://steamcommunity.com/id/" + steam_ID);
                if (result == -1) {
                    //Profile link is not valid, or profile is private
                    valid = false;
                    res.json([]);
                }
                else {
                    valid = true;
                }
            }
            else {
                valid = true;
            }
            if (valid) {
                let user = await User.create({ steamID: steam_ID });
                let activity = await Activity.create({ l2w: result });
                user.hours.push(activity);
                await user.save();
                res.json(user.hours);
            }

        }
        catch(e) {
            res.status(500);
            res.json({error: e});
        }
    }
});



module.exports = router;