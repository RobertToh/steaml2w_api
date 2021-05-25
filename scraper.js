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
        return parseFloat(hours.textContent);
    }
    catch (error) {
        console.log(error);
    }
}

getProfileHours("https://steamcommunity.com/profiles/76561198057982541/").then(res => console.log(res));