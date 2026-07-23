import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Workroom extends Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super("Workroom");
    }

    create() {
        this.cameras.main.setBackgroundColor(0x1f1b24);

        this.createRoom();
        this.createPlayer();
        this.createKeyboard();

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.movePlayer();
    }

    private createRoom() {
        // 작업실 외곽
        const room = this.add.rectangle(512, 384, 900, 650, 0xd8c2aa);

        room.setStrokeStyle(12, 0x46382f);

        // 벽
        this.add.rectangle(512, 170, 880, 220, 0xcbb49e);

        // 바닥
        this.add.rectangle(512, 480, 880, 420, 0x9a765e);

        // 임시 책상
        this.add.rectangle(260, 280, 240, 80, 0x654b3a);

        // 임시 모니터
        this.add.rectangle(260, 220, 110, 70, 0x292936);

        // 임시 책장
        this.add.rectangle(790, 280, 130, 250, 0x70503c);

        // 제목
        this.add
            .text(512, 90, "SUYEON'S DEVELOPER WORKROOM", {
                fontFamily: "Arial",
                fontSize: "28px",
                color: "#ffffff",
                fontStyle: "bold",
            })
            .setOrigin(0.5);
    }

    private createPlayer() {
        const graphics = this.make.graphics(
            {
                x: 0,
                y: 0,
            },
            false,
        );

        graphics.fillStyle(0x292936);
        graphics.fillRoundedRect(0, 0, 36, 52, 8);

        graphics.fillStyle(0xf1c5a4);
        graphics.fillCircle(18, 13, 10);

        graphics.generateTexture("player-placeholder", 36, 52);

        graphics.destroy();

        this.player = this.physics.add.sprite(512, 520, "player-placeholder");

        this.player.setCollideWorldBounds(true);

        this.physics.world.setBounds(62, 59, 900, 650);
    }

    private createKeyboard() {
        if (!this.input.keyboard) {
            throw new Error("Keyboard input is unavailable.");
        }

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    private movePlayer() {
        const speed = 180;

        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }

        const body = this.player.body;

        if (body instanceof Phaser.Physics.Arcade.Body) {
            body.velocity.normalize().scale(speed);
        }
    }
}
