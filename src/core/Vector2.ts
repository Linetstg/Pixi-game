export class Vector2 {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  distanceTo(other: Vector2): number {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }

  normalize(): Vector2 {
    const length = Math.sqrt(this.x ** 2 + this.y ** 2);
    return length > 0
      ? new Vector2(this.x / length, this.y / length)
      : new Vector2();
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }
}
