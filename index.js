var Bot = require('slackbots');

// create a bot
var settings = {
    token: process.env.SLACK_TOKEN,
    as_user: true
};
var bot = new Bot(settings);

bot.on('start', function () {
    // bot.postMessageToChannel('some-channel-name', 'Hello channel!');
    // bot.postMessageToUser('some-username', 'hello bro!');
    // bot.postMessageToGroup('some-private-group', 'hello group chat!');
});

bot.on('message', function (data) {
    // all ingoing events https://api.slack.com/rtm 
    var isMessage = data.type === "message";
    var isBot = data.subtype === "bot_message";


    if (isMessage && !isBot) {


        var message ="";
        if(data.text)
            message = data.text.toLowerCase();

        var response = null;
        switch (message) {
            case "tu tranquis":
                response = "ya nada";
                break;
            case "yo no fui":
                response = "tu bien sabes quien fue";
                break;
            case "te digo quien fue?":
            case "te digo quien fue":
                response = "no we, no me digas";
                break;
        }

        // no lower case for topics
        var message = data.text;
        console.log(message);

        if (message.substring(0, 19) == "<@U5F6MCKM4> topic ") {
            var command = "/topic";
            var newTopic = message.substring(19);

            // slash commands hidden api!
            bot._api('chat.command',{
                token: process.env.SLACK_TOKEN,
                command: command,
                channel: data.channel,
                text: newTopic
            })

            bot.postMessage(data.channel, "Como ordene maestro",  settings);
        }
        if (response !== null) {
            console.log(data);
            bot.postMessage(data.channel, response, settings);
        }

    }
});

// bind express app so process doesn't get killed by heroku
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var http = require('http').Server(app);
http.listen(port); //Listen on the specified port
console.log('Listening on port ' + port); //Write to the console

app.get('/', function (req, res) {
    res.send('Dunkel bot lives here!');
});
