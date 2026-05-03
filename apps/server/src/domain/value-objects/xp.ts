export class Xp {
  private constructor(public readonly value: number) {
    if (value < 0 || !Number.isInteger(value)) {
      throw new Error(`XP must be a non-negative integer, got ${value}`);
    }
  }

  static zero(): Xp {
    return new Xp(0);
  }

  add(amount: number): Xp {
    return new Xp(this.value + amount);
  }
}