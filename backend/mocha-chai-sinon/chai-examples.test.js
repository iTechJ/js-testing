const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should(); //actually call the function

//Additional chai configuration
chai.config.includeStack = false;
chai.config.showDiff = false;
chai.config.truncateThreshold = 0; // disable truncating (default: 40)

const nameService = require('../src/nameService');

describe('Chai examples', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const title = 'Ph.D.';
    
    const fullNameWithoutTitle = `${firstName} ${lastName}`;
    const fullNameWithTitle = `${firstName} ${lastName}, ${title}`;

    describe('different assertion styles', () => {
        it('should return full name without comma when the title is not present', () => {
            const result = nameService.getPersonFullName(firstName, lastName);

            assert.equal(result, fullNameWithoutTitle, 'full name without title equal first and last name');
            expect(result, '[full name without title]').to.equal(fullNameWithoutTitle);
            result.should.equal(fullNameWithoutTitle);
        });

        it('should throw the error when last name is not present', () => {
            const getResult = () => nameService.getPersonFullName(firstName);

            assert.throws(getResult, 'First and last name should be not blank.');
            expect(getResult).to.throw('First and last name should be not blank.');
            should.Throw(getResult, 'First and last name should be not blank.')
        });
    });

    describe('library toolkit', () => {
        const childObj = {childProp1: 'abcd'};
        const obj = {prop1: 'a', prop2: childObj};
        const objCopy = Object.assign({}, obj);

        it('objects comparison', () => {
            expect(obj).to.equal(obj);
            expect(obj).to.not.equal(objCopy);
            expect(obj).to.deep.equal(objCopy);
            expect(obj).to.deep.include({prop2: childObj});
            expect(obj).to.have.deep.property('prop2', childObj);
            expect(obj).to.nested.include({'prop2.childProp1': 'abcd'});
        });

        it('advanced methods chains', () => {
            expect(obj)
                .to.be.an('object')
                .and.to.have.all.keys('prop1', 'prop2')
                .but.not.to.have.any.keys('tmp1', 'tmp2');

            expect([11, 3, obj])
                .to.be.an('array')
                .that.includes(3)
                .with.deep.include(objCopy);
        });
    });

    describe('plugin usage', () => {
        chai.use(require('chai-json-schema'));
        chai.use(require('chai-as-promised'));

        it('should work with promise', () => {
            return Promise.resolve(2 + 2).should.eventually.equal(4);
        });

        var nameSchema = {
            type: 'object',
            required: ['firstName', 'lastName'],
            properties: {
                firstName: {
                    type: ['string']
                },
                lastName: {
                    type: ['string']
                },
                title: {
                    type: ['string', 'undefined']
                }
            }
        };

        it('should return name suitable for the name schema', () => {
            const name = nameService.splitPersonFullName('John Doe, B.Sc.');
            expect(name).to.be.jsonSchema(nameSchema);
        });

        it('should return name not suitable for the name schema', () => {
            const name = nameService.splitPersonFullName('John');
            expect(name).not.to.be.jsonSchema(nameSchema);
        });
    });
});
