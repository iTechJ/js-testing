const sinon = require('sinon');
const expect = require('chai').expect;

const nameService = require('../src/nameService');

describe('Sinon examples', () => {

    describe('spies', () => {

        it('resolved promise should call success callback', () => {
            const callback = sinon.spy();

            return Promise.resolve()
                .then(callback)
                .then(() => expect(callback.called).to.be.true)
                .then(() => expect(callback.calledOnce).to.be.true)
                .then(() => expect(callback.callCount).to.be.equal(1));
        });

        it('resolved promise should call success callback with provided value', () => {
            const callback = sinon.spy();
            const resolveValue = 42;

            return Promise.resolve(resolveValue)
                .then(callback)
                .then(() => expect(callback.calledWith(resolveValue)).to.be.true)
                .then(() => expect(callback.neverCalledWith(resolveValue + 1)).to.be.true)
                .then(() => expect(callback.calledWithExactly(resolveValue)).to.be.true)
                .then(() => expect(callback.calledWithMatch(resolveValue)).to.be.true)
                .then(() => expect(callback.alwaysCalledWith(resolveValue)).to.be.true)
                .then(() => expect(callback.firstCall.args[0]).to.be.equal(resolveValue))
                .then(() => expect(callback.getCall(0).args[0]).to.be.equal(resolveValue));
        });

        it('spy for existing function should work', () => {
            const spy = sinon.spy(nameService, 'getPersonFullName');

            nameService.getPersonFullName('firstName', 'lastName', 'title');

            expect(spy.calledOnce).to.be.true;

            nameService.getPersonFullName.restore();
        });
    });
});
