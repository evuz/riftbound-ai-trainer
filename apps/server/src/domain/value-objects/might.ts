export class Might {
  private constructor(public readonly value: number) {
    if (value < 0 || !Number.isInteger(value)) {
      throw new Error(`Might must be a non-negative integer, got ${value}`);
    }
  }

  static of(value: number): Might {
    return new Might(value);
  }
}