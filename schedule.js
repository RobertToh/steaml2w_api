const   Activity = require("./models/activity"),
        User = require("./models/user"),
        scraper = require("./scraper.js");

function daily_check(){
    console.log("Performing Daily Check!");
    User.find({}, function(err, users){
        if (err) {
            console.log(err);
        }
        else {
            users.forEach(function(user){
                scraper.getProfileHours("https://steamcommunity.com/profiles/" + user.steamID).then(function (result) {
                    let l2w;    
                    if (result == -1) {
                        //Profile link is no longer valid, or profile is private
                        l2w = 0;
                    }
                    else {
                        l2w = result;
                    }

                    Activity.create({
                        l2w: result
                    },
                    function (err, activity) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            user.hours.push(activity);
                            user.save();
                        }
                    });
                    
                });
            });
        }
    });
}

exports.daily_check = daily_check;