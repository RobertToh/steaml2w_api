const   axios = require("axios"),
        {JSDOM} = require("jsdom");

const getProfileHours = async (steam_url) => {
    try {
        let { data } = await axios.get(steam_url);
        const dom = new JSDOM(data, {
            //runScripts: "dangerously",
            //resources: "usable",
            url: "http://localhost/"
        });
        const { document }= dom.window;
        let hours = document.querySelector(".recentgame_recentplaytime h2");
        if (hours == null) {
            return -1;
        }
        else {
            return parseFloat(hours.textContent);
        }
    }
    catch (error) {
        console.log(error);
    }
}

// function getProfileHours (steam_url) {
//     try {
//         axios.get(steam_url)
//             .then(function(res){
//                 const dom = new JSDOM(res.data, {
//                     //runScripts: "dangerously",
//                     //resources: "usable",
//                     url: "http://localhost/"
//                 });
//                 const { document } = dom.window;
//                 let hours = document.querySelector(".recentgame_recentplaytime h2");
//                 console.log(hours);
//                 return parseFloat(hours.textContent);
//             });

//     }
//     catch (error) {
//         console.log(error);
//     }
// }

exports.getProfileHours = getProfileHours;

//getProfileHours("https://steamcommunity.com/profiles/76561198057982541/").then(res => console.log(res));
//console.log(getProfileHours("https://steamcommunity.com/profiles/76561198057982541/"));