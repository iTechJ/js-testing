const sinon = require('sinon');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');

describe('Proxyquire examples', () => {

    it('should replace request library', (done) => {
        const testName = 'testName';

        var nameService = proxyquire('../src/nameService', {
            'request-promise-native': function () {
                return Promise.resolve(`{"name": "${testName}"}`);
            }
        });

        nameService.getRandomNames(2).then((randomNames) => {
            expect(randomNames).to.deep.equal([testName]);
            done();
        }).catch(done);
    });
});
