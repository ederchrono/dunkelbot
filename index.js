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

        var message = data.text.toLowerCase();

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
            //response = "/topic "+message.substring(19);
            //console.log(response);
            //https://slack.com/api/channels.setTopic
            changeTopic(data.channel, message.substring(19));
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

var request = require('request');
function changeTopic(channel, newTopic) {
    // https://slack.com/api/channels.setTopic
    console.log("changing topic")

    request.post(
        'https://slack.com/api/channels.setTopic',
        { 
            json: { 
                token: settings.token,
                channel: channel,
                topic: newTopic
            } 
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
}