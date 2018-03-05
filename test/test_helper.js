const mongoose = require('mongoose');

//global.Promise is a reference to the es6 implementation of promises inside of node
mongoose.Promise = global.Promise;

//before tells mocha to wait before running it's tests
//it's only run one time
//once mongo connection is made run mocha's done function inside the success callback to inform mocha it can start running tests
before((done) => {
    mongoose.connect('mongodb://localhost/users_test');
    mongoose.connection
    .once('open', () => {done(); })
    .on('error', (error) => {
        console.warn('Warning', error);
    });
})


//mocha hook
beforeEach((done) => {
    const {users, comments, blogposts} = mongoose.connection.collections;
    users.drop(() => {
        comments.drop(() => {
            blogposts.drop(() => {
                done();
            })
        })
    });
});