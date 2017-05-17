var Bot = require('slackbots');

// create a bot
var settings = {
    token: process.env.SLACK_TOKEN,
    // name: 'Dunkelbot'
};
var bot = new Bot(settings);

bot.on('start', function() {
    // bot.postMessageToChannel('some-channel-name', 'Hello channel!');
    // bot.postMessageToUser('some-username', 'hello bro!');
    // bot.postMessageToGroup('some-private-group', 'hello group chat!');
});

bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm 
    var isMessage = data.type ==="message";
    var isBot = data.subtype === "bot_message";

    console.log(data);

    if( isMessage && !isBot ){

        var response = null;
        switch(data.text){
            case "tu tranquis":
                response = "ya nada";
                break;
            case "yo no fui":
                response = "tu bien sabes quien fue";
                break;
            case "te digo quien fue":
                response = "no we, no me digas";
                break;
        }

        if(response!==null){
            bot.postMessage(data.channel, response);            
        }

    }
});