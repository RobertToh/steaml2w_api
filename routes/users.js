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
router.post("/", async function(req,res) {
    if (req.body.steamID) {
        let steam_ID = req.sanitize(req.body.steamID);
        
        try {
            let result = await scraper.getProfileHours("https://steamcommunity.com/profiles/" + steam_ID);
            if (result == -1){
                //Profile link is not valid, or profile is private
                res.json([]);
            }
            else {
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