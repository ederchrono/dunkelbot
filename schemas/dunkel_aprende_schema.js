var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    keyPhrase: String,
    content: String,
    created_at: { type: Date, default: Date.now },    
});

module.exports = mongoose.model( 'DunkelbotCommand', messageSchema);
module.exports.schema = messageSchema;
