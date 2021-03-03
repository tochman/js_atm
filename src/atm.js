class Atm {
  carriedDenominations = [20, 10, 5]
  funds = 1000

  withdraw(amount, account, pin) {
    if (this.requestedAmountIsNotProcessable(amount)) {
      return { status: 'error', message: "We can not process this request" }
    } else if (this.wrongPinIsProvided(account, pin)) {
      return { status: 'error', message: "You used an incorrect pin" }
    } else if (account.balance <= amount) {
      return { status: 'error', message: "Your bank rejected the transaction" }
    } else {
      this.funds -= amount
      return { status: 'success', bills: this.billsToDispatch(amount) }
    }
  }

  wrongPinIsProvided(account, pin) {
    return account.pin !== pin
  }

  requestedAmountIsNotProcessable(amount) {
    return amount % 5 !== 0
  }

  billsToDispatch(amount) {
    let billsToDispatch = []
    this.carriedDenominations.forEach(denomination => {
      // first we look at the largest bill denomination and compare it to the amount that is supposed to be withdrawn
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