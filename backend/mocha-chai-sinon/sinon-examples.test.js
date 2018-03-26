const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

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

    describe('stubs', () => {
        let randomNamesStub;

        beforeEach(() => {
            randomNamesStub = sinon.stub(nameService, 'getRandomNames')
        });

        afterEach(() => {
            nameService.getRandomNames.restore();
        });

        it('stub with callsFake', () => {
            randomNamesStub.callsFake(() => {throw new Error('Stub error');});
            expect(nameService.getRandomNames).to.throw('Stub error');
        });
        
        it('stub with withArgs', () => {
            const testNames = ['Name 1', 'Name 2'];
            randomNamesStub.withArgs(2).returns(testNames);
            expect(nameService.getRandomNames(2)).to.deep.equal(testNames);
        });

        it('stub with onCall', () => {
            var callback = sinon.stub();
            callback.onCall(0).returns(1);
            callback.onCall(1).returns(2);
            callback.returns(3);

            expect(callback()).to.equal(1);
            expect(callback()).to.equal(2);
            expect(callback()).to.equal(3);
            expect(callback()).to.equal(3);
        });

        it('stub other useful methods', () => {
            var stub = sinon.stub();

            stub.returnsArg(1);
            expect(stub('arg0', 'arg1')).to.equal('arg1');

            stub.resetBehavior();
            expect(stub()).to.equal(undefined);

            stub.rejects(Error('Stub error'));
            return expect(stub()).to.be.rejectedWith(Error, 'Stub error');
        });
    });

    describe('fake timer', () => {
        function stopwatch(callback) {
            const interval = setInterval((params) => callback(params), 10000);
            return {
                stop: () => clearInterval(interval)
            };
        }

        it('should fire interval multiple times', () => {
            const clock = sinon.useFakeTimers();
            const callback = sinon.spy();

            const sw = stopwatch(callback);

            clock.tick(21000);

            expect(callback.callCount).to.equal(2);

            sw.stop();
            clock.restore();
        });
    });
});
