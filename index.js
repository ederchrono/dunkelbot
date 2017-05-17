var Bot = require('slackbots');

// create a bot
var settings = {
    token: process.env.SLACK_TOKEN,
    name: 'Hello bot'
};
var bot = new Bot(settings);

bot.on('start', function() {
    // bot.postMessageToChannel('some-channel-name', 'Hello channel!');
    // bot.postMessageToUser('some-username', 'hello bro!');
    // bot.postMessageToGroup('some-private-group', 'hello group chat!');
});

bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm 
    if(data.type=="message"){
        console.log(data);
        bot.postMessageToChannel(data.channel, 'Hola');
    }
});