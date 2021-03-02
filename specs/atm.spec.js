const { expect } = require('chai');
const sinon = require('sinon')
var chai = require("chai");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);


const Atm = require('../src/atm.js')

describe('ATM class', () => {
  let subject, account

  before(() => {
    account = { pin: null, balance: null }
    user = {}

    sinon.stub(account, 'pin').value('1234') // example of stubbibg a property7attribute value
    sinon.stub(account, 'balance').value('200')
  });

  beforeEach(() => {
    subject = new Atm()
  });

  it('does not allow for values not able to being handled by available denominations', () => {
    let response = subject.withdraw(52, account, '1234')
    expect(response.status).to.equal('error')
    expect(response.message).to.equal("We can not process this request")
  });

  it('allows withdrawal with the right pin code', () => {
    subject.withdraw(50, account, '1234')
    expect(subject.funds).to.equal(950)
  });

  it('do not allow withdrawal with the wrong pin code', () => {
    let response = subject.withdraw(50, account, '0000')
    expect(response.status).to.equal('error')
    expect(response.message).to.equal("You used an incorrect pin")
  });

  it('can be instantiated', () => {
    expect(subject).to.be.an('object')
  });

  it('has initial funds', () => {
    expect(subject.funds).to.equal(1000)
  });

  it('funds are reduced on withdraw', () => {
    subject.withdraw(50, account, "1234")
    expect(subject.funds).to.equal(950)
  });

  it('returns bills in denominations', () => {
    let response = subject.withdraw(50, account, "1234")
    let expectedBills = [20, 20, 10]
    expect(response.bills).to.eql(expectedBills) //'equal' won't work due to use  of strict or deep equality
  });
});