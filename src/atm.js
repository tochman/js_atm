class Atm {
  constructor() {
    this.carriedDenominations = [20, 10, 5]
    this.funds = 1000
  }
  withdraw(amount, account, pin) {
    if (!this.validateRequestedAmount(amount)) {
      return { status: 'error', message: "We can not process this request" }
    } else if (account.pin === pin) {
      return { status: 'success', bills: this.billsToDispatch(amount) }
    } else {
      return { status: 'error', message: "You used an incorrect pin" }
    }
  }

  validateRequestedAmount(amount) {
    return amount % 5 === 0
  }

  billsToDispatch(amount) {
    let billsToDispatch = []
      this.funds -= amount
      this.carriedDenominations.forEach(denomination => {
        // first we look at the largest bill denomination aand compare it to the amount that is supposed to be withdrawn
        // if amount is larger or equal to the denomination we enter the loop
        while (amount - denomination >= 0) {
          amount -= denomination // we reduce the amount with the value stored in the current denomination
          billsToDispatch.push(denomination)
        }
      })
      return billsToDispatch
  }
}

module.exports = Atm