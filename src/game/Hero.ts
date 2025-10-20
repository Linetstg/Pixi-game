import { GameObject } from "../core/GameObject";
import { Vector2 } from "../core/Vector2";
import { Animal } from "./Animal";

export class Hero extends GameObject {
  private speed: number = 200;
  private targetPosition: Vector2 | null = null;
  private collectedAnimals: Animal[] = [];
  private readonly maxAnimals: number = 5;

  constructor(x: number, y: number) {
    super(x, y);
    this.setupGraphics();
    this.container.x = x;
    this.container.y = y;
  }

  private setupGraphics(): void {
    this.graphics.circle(0, 0, 20);
    this.graphics.fill(0xff0000);
  }

  public setTarget(position: Vector2): void {
    this.targetPosition = position;
  }

  public update(deltaTime: number): void {
    if (this.targetPosition) {
      const direction = this.targetPosition.subtract(this.position).normalize();
      const movement = direction.multiply(this.speed * deltaTime);

      this.position = this.position.add(movement);

      if (this.position.distanceTo(this.targetPosition) < 5) {
        this.targetPosition = null;
      }
    }

    this.container.x = this.position.x;
    this.container.y = this.position.y;

    this.updateAnimalsPositions();
  }

  public render(): void {}

  public canCollectAnimal(): boolean {
    return this.collectedAnimals.length < this.maxAnimals;
  }

  public collectAnimal(animal: Animal): void {
    if (this.canCollectAnimal() && !this.collectedAnimals.includes(animal)) {
      this.collectedAnimals.push(animal);
      animal.follow(this);
    }
  }

  private updateAnimalsPositions(): void {
    const followDistance = 30;
    const angleStep = (2 * Math.PI) / Math.max(1, this.collectedAnimals.length);

    this.collectedAnimals.forEach((animal, index) => {
      const angle = index * angleStep;
      const offsetX = Math.cos(angle) * followDistance;
      const offsetY = Math.sin(angle) * followDistance;

      animal.setFollowOffset(offsetX, offsetY);
    });
  }

  public getCollectedAnimals(): Animal[] {
    return this.collectedAnimals;
  }

  public getGlobalPosition(): Vector2 {
    return new Vector2(this.container.x, this.container.y);
  }
}
