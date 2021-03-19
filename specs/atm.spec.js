const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect
const sinonChai = require('sinon-chai')
chai.use(sinonChai);


const Atm = require('../src/atm.js')

describe('ATM class', () => {
  let subject, sandbox, account, correctPinCode, wrongPinCode, response

  before(() => {
    account = { pin: null, balance: null }
    correctPinCode = '1234'
    wrongPinCode = '0000'
    sandbox = sinon.createSandbox()
  });

  beforeEach(() => {
    sandbox.stub(account, 'pin').value('1234') // example of stubbibg a property/attribute value
    sandbox.stub(account, 'balance').value('200')
    subject = new Atm()
  });

  afterEach(() => {
    sandbox.restore()
  });

  it('is expected to have 1000 initial funds', () => {
    expect(subject.funds).to.equal(1000)
  });

  describe('successful withdrawal', () => {
    it('is expected to reduce ATM funds on successful withdraw', () => {
      subject.withdraw(50, account, correctPinCode)
      expect(subject.funds).to.equal(950)
    });

    it('is expected to return an array of dispatched bills', () => {
      let response = subject.withdraw(50, account, correctPinCode)
      let expectedBills = [20, 20, 10]
      expect(response.bills).to.deep.equal(expectedBills) //'equal' won't work due to use  of strict or deep equality .eql or .deep.equal will work
    });
  });



  describe('rejected withdrawal ', () => {
    it('is expected NOT to reduce ATM funds', () => {
      subject.withdraw(50, account, wrongPinCode)
      expect(subject.funds).to.equal(1000)
    });

    describe('amount not processable by available denominations', () => {

      beforeEach(() => {
        response = subject.withdraw(52, account, correctPinCode)
      });
      it('is expected to return error status', () => {
        expect(response)
          .to.have.deep.property('status', 'error')
      });

      it('is expected to return error message', () => {
        expect(response)
          .to.have.deep.property('message', 'We can not process this request')
      });
    });

    describe('when provided the wrong pin code', () => {
      beforeEach(() => {
        response = subject.withdraw(50, account, wrongPinCode)
      });

      it('is expected to return error status', () => {
        expect(response)
          .to.have.deep.property('status', 'error')
      });

      it('is expected to return error message', () => {
        expect(response)
          .to.have.deep.property('message', 'You used an incorrect pin')
      });
    });

    describe('if account has a low balance', () => {
      beforeEach(() => {
        response = subject.withdraw(300, account, correctPinCode)
      });
      it('is expected to return error status', () => {
        expect(response)
          .to.have.deep.property('status', 'error')
      });

      it('is expected to return error message', () => {
        expect(response)
          .to.have.deep.property('message', 'Your bank rejected the transaction')
      });
    });
  });

});