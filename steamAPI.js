const   axios = require("axios");

const getProfileHours = async (steam_id) => {
    try {
        let url = "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=" + process.env.STEAMAPI_KEY + "&steamid=" + steam_id;
        let {data} = await axios.get(url);

        if (Object.keys(data.response).length === 0) {
            //Private profile
            return -1;
        }
        
        let games_data = data.response.games;
        if (games_data === undefined) {
            //Game data was hidden
            return -1;
        }
        let games_trim = []
        
        let total_mins = 0;
        games_data.forEach(game => {
            total_mins += game.playtime_2weeks;
            
            //Include only necessary fields
            let g = {
                appid: game.appid,
                name: game.name,
                playtime_2weeks: game.playtime_2weeks,
                img_logo_url: game.img_logo_url,
                img_icon_url: game.img_icon_url
            };
            games_trim.push(g);
        });

        let total_hours = parseFloat((total_mins / 60).toFixed(1));

        return {total_hours: total_hours, games: games_trim}
        
        //console.log(typeof data.response.games[0].playtime_2weeks);
    }
    catch (error) {
        console.log(error);
        return -1;
    }
}

const vanityToSteamID = async (id) => {
    try {        
        let url = "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" + process.env.STEAMAPI_KEY + "&vanityurl=" + id;
        let { data } = await axios.get(url);
        if (data.response.success === 1) {
            //Vanity was valid profile
            return data.response.steamid;
        }
        else {
            //Not valid profile
            return -1;
        }
    }
    catch (error) {
        console.log(error);
    }
}

exports.getProfileHours = getProfileHours;
exports.vanityToSteamID = vanityToSteamID;

//getProfileHours("76561198057982541").then(res => console.log(res));
//getProfileHours("76561198063640403").then(res => console.log(res));

//console.log(getProfileHours("https://steamcommunity.com/profiles/76561198057982541/"));