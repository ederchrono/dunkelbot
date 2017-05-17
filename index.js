//db config
var mongoose = require('mongoose');
var mongo_url = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost/test';
mongoose.connect(mongo_url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    // we're connected!
    console.log("Mongoose connected successfully");
});
mongoose.Promise = global.Promise;

var DunkelbotCommand = require('./schemas/dunkel_aprende_schema');

var Bot = require('slackbots');

// create admin
var adminSettings = {
    token: process.env.FULL_ACCESS_TOKEN,
    as_user: true
};
var admin = new Bot(adminSettings);

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


        var message = "";
        if (data.text)
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

        if (data.text == undefined)
            return;

        var botCommands = data.text.split(" ");
        if (botCommands[0] == "chrobot") {
            var command = botCommands[1];
            botCommands.splice(0, 2);
            chronoCommand(data.channel, command, botCommands.join(' '));
        } else if (botCommands[0] == "<@U5F6MCKM4>") {
            //dunkelbot
            var command = botCommands[1];
            botCommands.splice(0, 2);
            if (command == "echo") {
                response = botCommands.join(' ');
            }
            else if (command == 'azazel') {
                response = ":azazel::slowbody:";
            }
            else if (command == 'aprende') {
                response = saveDunkelCommand(botCommands.join(' '));
            }
            else {
                // possible dunkel aprende command
                getDunkelCommand(data.channel, command + ' ' + botCommands.join(' '));
            }
        }

        if (response !== null) {
            console.log(data);
            bot.postMessage(data.channel, response, settings);
        }

    }
});

function getDunkelCommand(channel, command) {

    console.log("looking for command: "+command);
    DunkelbotCommand.findOne({keyPhrase:command}).exec( (err, data) => {

        if (err) {
            return;
        }

        console.log(data);
        if(data){
            // console.log(data[0]);
            response = data.content;
            bot.postMessage(channel, response, settings);
        }

    });
}

function saveDunkelCommand(text) {
    var params = text.split(',');
    if (params.length != 2) {
        return 'ya nada, debes usar `@dunkelbot aprende key,value`';
    }
    var command = new DunkelbotCommand();
    var words = params[0].split(" ").length;

    keyPhrase = params[0];    
    if(words==1)
        keyPhrase = params[0]+' ';
    command.keyPhrase = keyPhrase;
    command.content = params[1];
    command.save();

    return 'Aprendí algo nuevo... o fue el señor Delgadillo?'
}

function chronoCommand(channel, chronoCommand, text) {
    var command = null;
    switch (chronoCommand) {
        case 'topic':
            command = '/topic'
            break;
        case 'gif':
            command = '/giphy'
            break;
    }

    if (command != null) {
        // slash commands hidden api!
        admin._api('chat.command', {
            channel: channel,
            command: command,
            text: text
        }).fail(function (data) {
            console.log('Command error:');
            console.log(data);
        }).then(function (data) {
            console.log('Command success:');
            console.log(data);
        })
    }
}

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
