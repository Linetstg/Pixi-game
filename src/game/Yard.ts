import { GameObject } from "../core/GameObject";
import { Vector2 } from "../core/Vector2";

export class Yard extends GameObject {
  private width: number;
  private height: number;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.setupGraphics();
    this.container.x = x;
    this.container.y = y;
  }

  private setupGraphics(): void {
    this.graphics.rect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    this.graphics.fill(0xffff00);
    this.graphics.alpha = 0.7;

    this.graphics.rect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    this.graphics.stroke({ color: 0xffaa00, width: 2 });
  }

  public update(deltaTime: number): void {}

  public render(): void {}

  public contains(position: Vector2): boolean {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    return (
      position.x >= this.position.x - halfWidth &&
      position.x <= this.position.x + halfWidth &&
      position.y >= this.position.y - halfHeight &&
      position.y <= this.position.y + halfHeight
    );
  }

  public getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.position.x - this.width / 2,
      y: this.position.y - this.height / 2,
      width: this.width,
      height: this.height,
    };
  }

  public getCenter(): Vector2 {
    return new Vector2(this.position.x, this.position.y);
  }
}
