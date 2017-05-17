var Bot = require('slackbots');

// create a bot
var settings = {
    token: process.env.SLACK_TOKEN,
    name: 'Bakman'
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
    var isMe = data.username === settings.name;

    if( isMessage && !isBot && !isMe ){
        console.log(data);
        bot.postMessage(data.channel, 'Hola');
    }
});