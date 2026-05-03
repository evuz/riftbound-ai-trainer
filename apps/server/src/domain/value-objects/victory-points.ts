export class VictoryPoints {
  private constructor(public readonly value: number) {
    if (value < 0 || value > 8) {
      throw new Error(`VictoryPoints must be 0-8, got ${value}`);
    }
  }

  static zero(): VictoryPoints {
    return new VictoryPoints(0);
  }

  static of(value: number): VictoryPoints {
    return new VictoryPoints(value);
  }

  add(amount: number): VictoryPoints {
    return new VictoryPoints(Math.min(8, this.value + amount));
  }

  isWinner(): boolean {
    return this.value >= 8;
  }
}