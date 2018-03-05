const mongoose = require('mongoose');

const assert = require("assert");

const User = require('../src/user');

const BlogPost = require('../src/blogPost');

describe('middleware', () => {
    let joe, blogPost;
    beforeEach((done) => {
        joe  = new User({name: 'Joe'});
        blogPost = new BlogPost({title: 'JS is Great', content: 'Yep it really is'});
        //mongoose knows to push in only the model's id to create the associations
        joe.blogPosts.push(blogPost);

        //Promise.all is a reference to the es6 spec for native promises
        Promise.all([joe.save(), blogPost.save()])
                .then(() => done());
    });

    it('user cleans up dangling blog posts on remove', (done)=>{
        joe.remove()
            .then(()=> BlogPost.count())
            .then((count) => {
                assert(count === 0)
                done();
            })
    })
})