const   express = require("express"),
        router = express.Router(),
        Activity = require("../models/activity"),
        User = require("../models/user"),
        steamAPI = require("../steamAPI.js");


//Show Route
router.get("/:id", async function(req, res){ 
    let id = req.sanitize(req.params.id);
    let steam_id; 
    if (req.query.vanity) {
        let vanity = parseInt(req.sanitize(req.query.vanity));
    
        if (vanity) {
            let result = await steamAPI.vanityToSteamID(id);
            if (result === -1) {
                res.json([]);
                return;
            }
            else {
                steam_id = result;
            }
        }
        else {
            steam_id = id;
        }

        User.findOne({ steamID: steam_id })
            .populate({
                path: "hours",
                select: "l2w log_date games -_id",
                options: { limit: 365, sort: { log_date: -1 } }
            })
            .exec(function (err, user) {
                if (err) {
                    res.status(500);
                    res.json({ error: err });
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
    }
    else {
        res.status(400)
        res.json([]);
    }
});


//Create Route
router.post("/", async function(req,res) {
    if (req.body.id && req.body.vanity) {
        try {
            let id = req.sanitize(req.body.id);
            let vanity = parseInt(req.sanitize(req.body.vanity));
            let steam_id;

            if (vanity) {
                let result = await steamAPI.vanityToSteamID(id);
                if (result === -1) {
                    res.json([]);
                    return;
                }
                else {
                    steam_id = result;
                }
            }
            else {
                steam_id = id;
            }
    
            let result = await steamAPI.getProfileHours(steam_id);
            if (result === -1) {
                //Profile is private
                console.log("private");
                res.json([]);
            }
            else {
                let user = await User.create({ steamID: steam_id });
                let activity = await Activity.create({ l2w: result.total_hours, games: result.games });
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