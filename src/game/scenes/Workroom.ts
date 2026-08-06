import { Scene, Input, GameObjects, Physics } from "phaser";
import { EventBus } from "../EventBus";

export class Workroom extends Scene {
    private keys: any;
    private player: Phaser.GameObjects.Rectangle & {
        body: Physics.Arcade.Body;
    };
    constructor() {
        super("Workroom");
    }

    preload() {
        this.load.tilemapTiledJSON("workroom", "/assets/map/workroom.json");
        this.load.image("interior", "assets/tiles/interior.png");
    }

    create() {
        const map = this.make.tilemap({ key: "workroom" });

        const tileset = map.addTilesetImage("interior", "interior");

        if (!tileset) {
            throw new Error("interior 타일셋을 찾지 못하였습니다.");
        }
        map.createLayer("floor", tileset, 0, 0);
        map.createLayer("wall", tileset, 0, 0);
        map.createLayer("furniture", tileset, 0, 0);

        this.cameras.main.setZoom(3);
        this.cameras.main.centerOn(
            map.widthInPixels / 2,
            map.heightInPixels / 2,
        );
        // this.cameras.main.setZoom(3);
        this.cameras.main.setBackgroundColor("#d8c2aa");

        this.add.rectangle(512, 420, 500, 360, 0xc99f70); // 방
        this.add.rectangle(512, 290, 200, 100, 0x9a6e4d); // 책상
        this.add.rectangle(510, 390, 50, 50, 0x9a6e4d); // 의자
        this.add.rectangle(510, 290, 40, 40, 0x4e7ca5);
        const player = this.add.rectangle(96, 120, 12, 12, 0x4f86b3);
        this.physics.add.existing(player);
        this.player = player as GameObjects.Rectangle & {
            body: Physics.Arcade.Body;
        };

        const collisionLayer = map.getObjectLayer("collision");
        const collisionGroup = this.physics.add.staticGroup();

        collisionLayer?.objects.forEach((object) => {
            if (
                object.x === undefined ||
                object.y === undefined ||
                object.width === undefined ||
                object.height === undefined
            ) {
                return;
            }

            const collisionBox = this.add.rectangle(
                object.x + object.width / 2,
                object.y + object.height / 2,
                object.width,
                object.height,
            );

            collisionBox.setVisible(false);

            this.physics.add.existing(collisionBox, true);
            collisionGroup.add(collisionBox);
        });

        this.physics.add.collider(this.player, collisionGroup);

        this.keys = this.input.keyboard?.addKeys({
            W: Input.Keyboard.KeyCodes.W,
            A: Input.Keyboard.KeyCodes.A,
            S: Input.Keyboard.KeyCodes.S,
            D: Input.Keyboard.KeyCodes.D,
            E: Input.Keyboard.KeyCodes.E,
        });

        // this.add
        //     .text(512, 100, "SUYEON'S WORKROOM", {
        //         fontFamily: "Arial",
        //         fontSize: "32px",
        //         color: "#2f2926",
        //     })
        //     .setOrigin(0.5);

        // EventBus.emit("current-scene-ready", this);
    }

    update() {
        const speed = 120;
        const body = this.player.body;
        body.setVelocity(0);

        if (this.keys.W.isDown) body.setVelocityY(-speed);
        if (this.keys.S.isDown) body.setVelocityY(speed);
        if (this.keys.A.isDown) body.setVelocityX(-speed);
        if (this.keys.D.isDown) body.setVelocityX(speed);

        this.player.body.velocity.normalize().scale(speed);
        // if (this.keys.W.isDown) {
        //     console.log("w is pressed");
        //     this.player.y -= 1;
        // }
        // if (this.keys.S.isDown) {
        //     this.player.y += 1;
        // }
        // if (this.keys.A.isDown) {
        //     this.player.x -= 1;
        // }
        // if (this.keys.D.isDown) {
        //     this.player.x += 1;
        // }
        // if (this.keys.E.isDown) {
        //     console.log("e is pressed");
        // }
    }
}

