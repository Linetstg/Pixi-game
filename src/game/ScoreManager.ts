import { Text } from "pixi.js";

export class ScoreManager {
  private score: number = 0;
  private scoreText: Text;

  constructor() {
    this.scoreText = new Text({
      text: `Score: ${this.score}`,
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xffffff,
        stroke: { color: 0x000000, width: 4 },
      },
    });

    this.scoreText.x = 10;
    this.scoreText.y = 10;
  }

  public addScore(points: number = 1): void {
    this.score += points;
    this.scoreText.text = `Score: ${this.score}`;
  }

  public getScore(): number {
    return this.score;
  }

  public getScoreText(): Text {
    return this.scoreText;
  }
}
