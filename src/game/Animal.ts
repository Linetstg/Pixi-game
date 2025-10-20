import { GameObject } from "../core/GameObject";
import { Vector2 } from "../core/Vector2";
import { Hero } from "./Hero";

export class Animal extends GameObject {
  private followTarget: Hero | null = null;
  private followOffset: Vector2 = new Vector2();
  private speed: number = 180;
  private isInYard: boolean = false;

  private patrolPoints: Vector2[] = [];
  private currentPatrolIndex: number = 0;
  private isPatrolling: boolean = false;
  private patrolSpeed: number = 80;
  private waitTimer: number = 0;
  private waitDuration: number = 0;
  private isWaiting: boolean = false;

  constructor(x: number, y: number) {
    super(x, y);
    this.setupGraphics();
    this.container.x = x;
    this.container.y = y;
    this.generatePatrolPoints();
    this.startPatrolling();
  }

  private setupGraphics(): void {
    this.graphics.circle(0, 0, 15);
    this.graphics.fill(0xffffff);
  }

  private generatePatrolPoints(): void {
    const numPoints = 3 + Math.floor(Math.random() * 3);
    const baseRadius = 80 + Math.random() * 120;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const radius = baseRadius * (0.8 + Math.random() * 0.4);

      const pointX = this.position.x + Math.cos(angle) * radius;
      const pointY = this.position.y + Math.sin(angle) * radius;

      const boundedX = Math.max(50, Math.min(750, pointX));
      const boundedY = Math.max(50, Math.min(550, pointY));

      this.patrolPoints.push(new Vector2(boundedX, boundedY));
    }
  }

  private startPatrolling(): void {
    this.isPatrolling = true;
    this.isWaiting = false;
    this.currentPatrolIndex = 0;
  }

  public update(deltaTime: number): void {
    if (this.followTarget && !this.isInYard) {
      this.followHero(deltaTime);
    } else if (this.isPatrolling && !this.isInYard) {
      this.updatePatrol(deltaTime);
    }

    this.container.x = this.position.x;
    this.container.y = this.position.y;
  }

  public render(): void {}

  private followHero(deltaTime: number): void {
    if (!this.followTarget) return;

    const targetPosition = this.followTarget
      .getGlobalPosition()
      .add(this.followOffset);
    const direction = targetPosition.subtract(this.position).normalize();
    const movement = direction.multiply(this.speed * deltaTime);

    this.position = this.position.add(movement);

    if (this.position.distanceTo(targetPosition) < 5) {
      this.position = targetPosition;
    }
  }

  private updatePatrol(deltaTime: number): void {
    if (this.patrolPoints.length === 0) return;

    if (this.isWaiting) {
      this.waitTimer += deltaTime;
      if (this.waitTimer >= this.waitDuration) {
        this.isWaiting = false;
        this.waitTimer = 0;
        this.moveToNextPatrolPoint();
      }
      return;
    }

    const currentTarget = this.patrolPoints[this.currentPatrolIndex];
    const direction = currentTarget.subtract(this.position).normalize();
    const movement = direction.multiply(this.patrolSpeed * deltaTime);

    this.position = this.position.add(movement);

    if (this.position.distanceTo(currentTarget) < 10) {
      this.reachedPatrolPoint();
    }
  }

  private reachedPatrolPoint(): void {
    this.waitDuration = 1 + Math.random() * 2;
    this.waitTimer = 0;
    this.isWaiting = true;
  }

  private moveToNextPatrolPoint(): void {
    this.currentPatrolIndex =
      (this.currentPatrolIndex + 1) % this.patrolPoints.length;
  }

  public follow(hero: Hero): void {
    this.followTarget = hero;
    this.isPatrolling = false;
    this.isWaiting = false;
  }

  public stopFollowing(): void {
    this.followTarget = null;
    this.startPatrolling();
  }

  public setFollowOffset(x: number, y: number): void {
    this.followOffset = new Vector2(x, y);
  }

  public markAsInYard(): void {
    this.isInYard = true;
    this.followTarget = null;
    this.isPatrolling = false;
    this.isWaiting = false;
  }

  public getIsInYard(): boolean {
    return this.isInYard;
  }

  public getGlobalPosition(): Vector2 {
    return new Vector2(this.container.x, this.container.y);
  }
}
