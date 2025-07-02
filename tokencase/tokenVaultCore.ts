export class TokenVault {
  private balance: number = 0

  deposit(amount: number): void {
    this.balance += amount
  }

  withdraw(amount: number): boolean {
    if (amount > this.balance) return false
    this.balance -= amount
    return true
  }

  getBalance(): number {
    return this.balance
  }
}
