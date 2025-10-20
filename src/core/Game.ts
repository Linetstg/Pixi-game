import { Application, Container } from "pixi.js";
import { GameObject } from "./GameObject";

export class Game {
  public app: Application;
  private gameObjects: GameObject[] = [];

  constructor(width: number, height: number) {
    this.app = new Application();

    this.app
      .init({
        width,
        height,
        backgroundColor: 0x1099bb,
        backgroundAlpha: 1,
      })
      .then(() => {
        const container = document.getElementById("pixi-container");
        if (container) {
          container.appendChild(this.app.canvas);
        }

        this.app.canvas.style.display = "block";
        this.app.canvas.style.margin = "0 auto";
      })
      .catch((error) => {
        console.error("PixiJS init error:", error);
      });
  }

  public start(): void {
    this.app.ticker.add(() => this.gameLoop());
  }

  private gameLoop(): void {
    const deltaTime = this.app.ticker.deltaMS / 1000;
    this.update(deltaTime);
    this.render();
  }

  private update(deltaTime: number): void {
    this.gameObjects.forEach((gameObject) => gameObject.update(deltaTime));
  }

  private render(): void {
    this.gameObjects.forEach((gameObject) => gameObject.render());
  }

  public addGameObject(gameObject: GameObject): void {
    this.gameObjects.push(gameObject);

    if (this.app.stage) {
      this.app.stage.addChild(gameObject.container);
    } else {
      setTimeout(() => this.addGameObject(gameObject), 100);
    }
  }

  public removeGameObject(gameObject: GameObject): void {
    const index = this.gameObjects.indexOf(gameObject);
    if (index > -1) {
      this.gameObjects.splice(index, 1);
      if (this.app.stage) {
        this.app.stage.removeChild(gameObject.container);
      }
    }
  }

  public get stage(): Container {
    return this.app.stage;
  }
}
