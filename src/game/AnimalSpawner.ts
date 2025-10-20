import { Animal } from "./Animal";
import { Game } from "../core/Game";

export class AnimalSpawner {
  private game: Game;
  private spawnArea: { x: number; y: number; width: number; height: number };
  private spawnInterval: number = 3000;
  private maxAnimals: number = 10;
  private lastSpawnTime: number = 0;
  public animals: Animal[] = [];

  constructor(
    game: Game,
    spawnArea: { x: number; y: number; width: number; height: number }
  ) {
    this.game = game;
    this.spawnArea = spawnArea;
  }

  public update(deltaTime: number): void {
    this.lastSpawnTime += deltaTime * 1000;

    if (
      this.lastSpawnTime >= this.spawnInterval &&
      this.animals.length < this.maxAnimals
    ) {
      this.spawnAnimal();
      this.lastSpawnTime = 0;
      this.spawnInterval = 2000 + Math.random() * 4000;
    }
  }

  private spawnAnimal(): void {
    const x = this.spawnArea.x + Math.random() * this.spawnArea.width;
    const y = this.spawnArea.y + Math.random() * this.spawnArea.height;

    const animal = new Animal(x, y);
    this.animals.push(animal);
    this.game.addGameObject(animal);
  }

  public removeAnimal(animal: Animal): void {
    const index = this.animals.indexOf(animal);
    if (index > -1) {
      this.animals.splice(index, 1);
      this.game.removeGameObject(animal);
    }
  }

  public getAnimals(): Animal[] {
    return this.animals;
  }
}
