const assert = require('assert');
const User = require('../src/user');
describe('Creating records', () => {
    it('saves a user', (done) => {
       const joe = new User({name: "Joeyt"});
       joe.save()
        .then(() => {
            //if joe is not new than the test will fail
            assert(!joe.isNew);
            done();
        })
    });
});