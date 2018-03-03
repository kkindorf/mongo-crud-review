const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: String
});
//not creating a mongoose model since it's a not a distinct document. it's a sub document for user
module.exports = PostSchema;