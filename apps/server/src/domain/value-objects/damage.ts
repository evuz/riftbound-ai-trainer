import { Might } from './might';

export class Damage {
  private constructor(public readonly value: number) {
    if (value < 0 || !Number.isInteger(value)) {
      throw new Error(`Damage must be a non-negative integer, got ${value}`);
    }
  }

  static zero(): Damage {
    return new Damage(0);
  }

  static of(value: number): Damage {
    return new Damage(value);
  }

  add(amount: number): Damage {
    return new Damage(this.value + amount);
  }

  heal(amount: number): Damage {
    return new Damage(Math.max(0, this.value - amount));
  }

  isLethal(might: Might): boolean {
    return this.value >= might.value;
  }
}