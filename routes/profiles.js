const { default: axios } = require("axios");

const   express = require("express"),
        router = express.Router(),
        steamAPI = require("../steamAPI.js");

//Show Route
router.get("/:id", async function (req, res){
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

        //Get profile information from steam api
        let url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + process.env.STEAMAPI_KEY + "&steamids=" + steam_id;
        let {data} = await axios.get(url);
        let player = data.response.players[0];
        res.json({
            personaname: player.personaname,
            avatar: player.avatarfull
        });
    }
    else {
        res.status(400)
        res.json([]);
    }
});

module.exports = router;