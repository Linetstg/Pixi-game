import { Graphics, Text } from "pixi.js";
import { Game } from "./core/Game";
import { Hero } from "./game/Hero";
import { Yard } from "./game/Yard";
import { ScoreManager } from "./game/ScoreManager";
import { Vector2 } from "./core/Vector2";
import { AnimalSpawner } from "./game/AnimalSpawner";

class AnimalCollectionGame {
  private game: Game;
  private hero!: Hero;
  private yard!: Yard;
  private animalSpawner!: AnimalSpawner;
  private scoreManager!: ScoreManager;
  private gameField!: Graphics;

  constructor() {
    this.game = new Game(800, 600);

    setTimeout(() => {
      this.initializeGame();
    }, 1000);
  }

  private initializeGame(): void {
    this.createGameObjects();
    this.setupInteractivity();
    this.game.start();
  }

  private createGameObjects(): void {
    this.gameField = this.createGameField();
    this.scoreManager = new ScoreManager();
    this.animalSpawner = new AnimalSpawner(this.game, {
      x: 50,
      y: 50,
      width: 600,
      height: 500,
    });
    this.hero = new Hero(100, 300);
    this.yard = new Yard(700, 300, 100, 150);

    this.setupGame();
  }

  private createGameField(): Graphics {
    const gameField = new Graphics();
    gameField.rect(0, 0, 800, 600);
    gameField.fill(0x00ff00);
    gameField.alpha = 0.3;
    return gameField;
  }

  private setupGame(): void {
    this.game.stage.addChild(this.gameField);
    this.game.addGameObject(this.hero);
    this.game.addGameObject(this.yard);
    this.game.stage.addChild(this.scoreManager.getScoreText());

    const instructionText = new Text({
      text: "Click to move hero. Collect white animals (max 5) and bring to yellow yard",
      style: {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xffffff,
      },
    });
    instructionText.x = 150;
    instructionText.y = 20;
    this.game.stage.addChild(instructionText);

    const yardIndicator = new Text({
      text: "YARD",
      style: {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xffff00,
      },
    });
    yardIndicator.x = 670;
    yardIndicator.y = 250;
    this.game.stage.addChild(yardIndicator);

    const heroIndicator = new Text({});
    heroIndicator.x = 80;
    heroIndicator.y = 280;
    this.game.stage.addChild(heroIndicator);

    setTimeout(() => {
      this.spawnInitialAnimals();
    }, 500);
  }

  private setupInteractivity(): void {
    const canvas = this.game.app.canvas;

    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.hero.setTarget(new Vector2(x, y));
    });

    this.game.app.ticker.add(() => this.update());
  }

  private spawnInitialAnimals(): void {
    const initialAnimalCount = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < initialAnimalCount; i++) {
      setTimeout(() => {
        this.animalSpawner.update(1000);
      }, i * 1000);
    }
  }

  private update(): void {
    const deltaTime = this.game.app.ticker.deltaMS / 1000;

    this.animalSpawner.update(deltaTime);

    this.checkAnimalCollections();
    this.checkYardDeliveries();
  }

  private checkAnimalCollections(): void {
    const animals = this.animalSpawner.animals;

    animals.forEach((animal) => {
      if (
        !animal.getIsInYard() &&
        !this.hero.getCollectedAnimals().includes(animal) &&
        this.hero.canCollectAnimal()
      ) {
        const heroPos = this.hero.getGlobalPosition();
        const animalPos = animal.getGlobalPosition();
        const distance = heroPos.distanceTo(animalPos);

        if (distance < 40) {
          this.hero.collectAnimal(animal);
        }
      }
    });
  }

  private checkYardDeliveries(): void {
    const yardBounds = this.yard.getBounds();
    const collectedAnimals = [...this.hero.getCollectedAnimals()];

    collectedAnimals.forEach((animal) => {
      const animalPos = animal.getGlobalPosition();

      const isInYard =
        animalPos.x >= yardBounds.x &&
        animalPos.x <= yardBounds.x + yardBounds.width &&
        animalPos.y >= yardBounds.y &&
        animalPos.y <= yardBounds.y + yardBounds.height;

      if (isInYard) {
        this.scoreManager.addScore(1);

        animal.markAsInYard();

        const index = this.hero.getCollectedAnimals().indexOf(animal);
        if (index > -1) {
          this.hero.getCollectedAnimals().splice(index, 1);
        }
        this.animalSpawner.removeAnimal(animal);
      }
    });
  }
}

window.addEventListener("load", () => {
  new AnimalCollectionGame();
});
