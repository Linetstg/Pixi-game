import { Container, Graphics } from "pixi.js";
import { Vector2 } from "./Vector2";

export abstract class GameObject {
  public position: Vector2;
  public velocity: Vector2;
  public container: Container;
  public graphics: Graphics;

  constructor(x: number = 0, y: number = 0) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2();
    this.container = new Container();
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
  }

  abstract update(deltaTime: number): void;
  abstract render(): void;

  public getGlobalPosition(): Vector2 {
    return new Vector2(this.container.x, this.container.y);
  }
}
