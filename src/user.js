const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = require('./post')

const UserSchema = new Schema({
    name: {
        type: String,
        validate: {
            validator: (name) => name.length > 2,
            message: 'Name must be longer than two characters.'
        },
        required: [true, 'Name is required.']
    },
    posts: [PostSchema],
    likes: Number,
    blogPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'blogPost'
    }]
});
//using function() here is because the scope of this stays with the current instance of user
UserSchema.virtual('postCount').get(function() {
    //return the current instance of the model
    return this.posts.length;
});

//middleware goes in the model we want to apply it to
UserSchema.pre('remove', function(next) {
    const BlogPost = mongoose.model('blogPost');

    //the $in operator tells mongoose to look through the user's blogPosts array. If an id from any of the BlogPost instances is in that array, then remove that record
    BlogPost.remove({_id: {$in: this.blogPosts } })
    .then(() => next());
});
const User = mongoose.model('user', UserSchema);

module.exports = User;