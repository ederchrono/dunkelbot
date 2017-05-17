var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    key: String,
    content: String,
    created_at: { type: Date, default: Date.now },    
});

module.exports = mongoose.model( 'DunkelbotCommand', messageSchema);
module.exports.schema = messageSchema;
