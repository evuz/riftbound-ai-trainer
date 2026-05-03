export class Energy {
  private constructor(public readonly value: number) {
    if (value < 0 || !Number.isInteger(value)) {
      throw new Error(`Energy must be a non-negative integer, got ${value}`);
    }
  }

  static of(value: number): Energy {
    return new Energy(value);
  }

  static zero(): Energy {
    return new Energy(0);
  }

  add(other: Energy): Energy {
    return new Energy(this.value + other.value);
  }

  subtract(other: Energy): Energy {
    return new Energy(Math.max(0, this.value - other.value));
  }

  isZero(): boolean {
    return this.value === 0;
  }
}