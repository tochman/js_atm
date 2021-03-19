const sinon = require('sinon')
const chai = require('chai')
const expect  = chai.expect
const sinonChai = require('sinon-chai')
chai.use(sinonChai);


const Atm = require('../src/atm.js')

describe('ATM class', () => {
  let subject, sandbox, account, correctPinCode, wrongPinCode

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

  it('is exprected to reject withdrawal of amount not processable by available denominations', () => {
    let response = subject.withdraw(52, account, '1234')
    expect(response.status).to.equal('error')
    expect(response.message).to.equal("We can not process this request")
  });

  it('is expected to allow withdrawal when provided the right pin code', () => {
    subject.withdraw(50, account, correctPinCode)
    expect(subject.funds).to.equal(950)
  });

  it('is exprected to reject withdrawal when provided the wrong pin code', () => {
    let response = subject.withdraw(50, account, wrongPinCode)
    expect(response.status).to.equal("error")
    expect(response.message).to.equal("You used an incorrect pin")
  });

  it('is expected to have 1000 initial funds', () => {
    expect(subject.funds).to.equal(1000)
  });

  it('is expected to reduce ATM funds on successful withdraw', () => {
    subject.withdraw(50, account, correctPinCode)
    expect(subject.funds).to.equal(950)
  });

  it('is expected NOT to reduce ATM funds on rejected withdraw', () => {
    subject.withdraw(50, account, '0000')
    expect(subject.funds).to.equal(1000)
  });

  it('is expected to return an array of dispatched bills', () => {
    let response = subject.withdraw(50, account, correctPinCode)
    let expectedBills = [20, 20, 10]
    expect(response.bills).to.deep.equal(expectedBills) //'equal' won't work due to use  of strict or deep equality .eql or .deep.equal will work
  });

  it('is expected to reject a withdrawal if account has a low balance', () => {
    let response = subject.withdraw(300, account, correctPinCode)
    expect(response.status).to.equal("error")
    expect(response.message).to.equal("Your bank rejected the transaction")
  });
});