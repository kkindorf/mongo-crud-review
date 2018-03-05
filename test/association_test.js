const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
    let joe, blogPost, comment;

    beforeEach((done) => {
        joe  = new User({name: 'Joe'});
        blogPost = new BlogPost({title: 'JS is Great', content: 'Yep it really is'});
        comment = new Comment({content: 'Congrats on great post'});
        //mongoose knows to push in only the model's id to create the associations
        joe.blogPosts.push(blogPost);
        blogPost.comments.push(comment);
        comment.user = joe;

        //Promise.all is a reference to the es6 spec for native promises
        Promise.all([joe.save(), blogPost.save(), comment.save()])
                .then(() => done());
    });

    it('saves a relation between a user and a blog post', (done) => {
        //.then() is used to execute the actual query
        //.populate is used to load up the entire blogPost content
        User.findOne({name: 'Joe'})
            .populate('blogPosts')
            .then((user) => {
                assert(user.blogPosts[0].title === 'JS is Great')
                done();
            })
    })

    it('saves a full relation graph', (done) => {
        User.findOne({name: 'Joe'})
            .populate({
                //path here is telling mongoose to look into the blogPost property for the queried user and find any associations in there
                path: 'blogPosts',
                // populate here is telling mongoose to go and grab the comment relationship for the blogPosts associated with this user
                populate: {
                    path: 'comments',
                    model: 'comment',
                    populate: {
                        path: 'user',
                        model: 'user'
                    }
                }
            })
            .then((user)=> {
                assert(user.name == 'Joe');
                assert(user.blogPosts[0].title === 'JS is Great')
                assert(user.blogPosts[0].comments[0].content === 'Congrats on great post')
                assert(user.blogPosts[0].comments[0].user.name === 'Joe')
                done();
            })
    })
});