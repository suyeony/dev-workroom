import { Scene, Input, GameObjects, Physics } from "phaser";
import { EventBus } from "../EventBus";
import { projects } from "../data/projects";

export class Workroom extends Scene {
    private keys: any;
    private player!: Physics.Arcade.Sprite;
    private lastDirection: "up" | "down" | "left" | "right" = "down";
    private computerZone!: GameObjects.Zone;
    private isNearComputer = false;
    private interactionText!: GameObjects.Text;
    private portfolioPopup!: GameObjects.Container;
    private isPopupOpen = false;
    private selectedProjectIndex = 0;
    private projectListTexts: GameObjects.Text[] = [];
    private projectTitleText!: GameObjects.Text;
    private projectTechText!: GameObjects.Text;
    private projectDescriptionText!: GameObjects.Text;
    private projectHighlightsText!: GameObjects.Text;

    constructor() {
        super("Workroom");
    }

    preload() {
        this.load.tilemapTiledJSON("workroom", "/assets/map/workroom.json");
        this.load.image("interior", "assets/tiles/interior.png");
        this.load.spritesheet("player", "/assets/player/player.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
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
        // const player = this.add.rectangle(96, 120, 12, 12, 0x4f86b3);
        this.player = this.physics.add.sprite(96, 120, "player", 0);
        const body = this.player.body;
        if (body instanceof Physics.Arcade.Body) {
            body.setSize(14, 10);
            body.setOffset(9, 20);
        }
        this.anims.create({
            key: "walk-down",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 3,
            }),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: "walk-left",
            frames: this.anims.generateFrameNumbers("player", {
                start: 4,
                end: 7,
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: "walk-right",
            frames: this.anims.generateFrameNumbers("player", {
                start: 8,
                end: 11,
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: "walk-up",
            frames: this.anims.generateFrameNumbers("player", {
                start: 12,
                end: 15,
            }),
            frameRate: 8,
            repeat: -1,
        });

        const interactionLayer = map.getObjectLayer("interaction");

        const computerObject = interactionLayer?.objects.find(
            (object) => object.name === "computer",
        );

        if (
            computerObject &&
            computerObject.x !== undefined &&
            computerObject.y !== undefined &&
            computerObject.width !== undefined &&
            computerObject.height !== undefined
        ) {
            this.computerZone = this.add.zone(
                computerObject.x + computerObject.width / 2,
                computerObject.y + computerObject.height / 2,
                computerObject.width,
                computerObject.height,
            );

            this.physics.add.existing(this.computerZone, true);
        }

        this.interactionText = this.add
            .text(0, 0, "E 키를 눌러주세요", {
                fontSize: "8px",
                color: "#ffffff",
                backgroundColor: "#2f2926",
                padding: {
                    x: 4,
                    y: 2,
                },
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setVisible(false);

        const popupBg = this.add.rectangle(0, 0, 540, 330, 0x1f2937);

        const title = this.add
            .text(-250, -100, "SUYEON's PROJECTS", {
                fontSize: "16px",
                color: "#ffffff",
            })
            .setOrigin(0, 0.5);

        this.projectListTexts = projects.map((project, index) => {
            return this.add
                .text(
                    -250,
                    -60 + index * 25,
                    `${index === 0 ? ">" : " "} ${project.title}`,
                    {
                        fontSize: "13px",
                        color: index === 0 ? "#75a7d6" : "#ffffff",
                    },
                )
                .setOrigin(0, 0.5);
        });

        const selectedProject = projects[this.selectedProjectIndex];

        this.projectTitleText = this.add.text(40, -80, selectedProject.title, {
            fontSize: "16px",
            color: "#75a7d6",
        });

        this.projectTechText = this.add.text(40, -55, selectedProject.tech, {
            fontSize: "11px",
            color: "#ffffff",
        });

        this.projectDescriptionText = this.add.text(
            40,
            -25,
            selectedProject.description,
            {
                fontSize: "12px",
                color: "#ffffff",
            },
        );

        this.projectHighlightsText = this.add.text(
            40,
            10,
            selectedProject.highlights
                .map((highlight) => `· ${highlight}`)
                .join("\n"),
            {
                fontSize: "11px",
                color: "#d1d5db",
                lineSpacing: 4,
            },
        );

        const openButton = this.add
            .text(0, 10, "포트폴리오 열기", {
                fontSize: "9px",
                color: "#ffffff",
                backgroundColor: "#4e7ca5",
                padding: {
                    x: 8,
                    y: 5,
                },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        openButton.on("pointerdown", () => {
            window.open("포트폴리오_URL", "_blank");
        });

        const camera = this.cameras.main;

        this.portfolioPopup = this.add.container(
            camera.midPoint.x,
            camera.midPoint.y,
            [
                popupBg,
                title,
                ...this.projectListTexts,
                this.projectTitleText,
                this.projectTechText,
                this.projectDescriptionText,
                this.projectHighlightsText,
            ],
        );

        this.portfolioPopup
            .setDepth(1000)
            .setScale(1 / 3)
            .setVisible(false);

        const project = projects[this.selectedProjectIndex];

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
    }

    private updateProjectInfo() {
        const project = projects[this.selectedProjectIndex];

        // 왼쪽 목록
        this.projectListTexts.forEach((text, index) => {
            const isSelected = index === this.selectedProjectIndex;

            text.setText(`${isSelected ? ">" : " "} ${projects[index].title}`);

            text.setColor(isSelected ? "#75a7d6" : "#ffffff");
        });

        // 오른쪽 내용
        this.projectTitleText.setText(project.title);
        this.projectTechText.setText(project.tech);
        this.projectDescriptionText.setText(project.description);

        this.projectHighlightsText.setText(
            project.highlights.map((highlight) => `· ${highlight}`).join("\n"),
        );
    }

    update() {
        const speed = 120;
        // const body = this.player.body;
        this.player.setVelocity(0);
        // 팝업이 열려있는 경우
        if (this.isPopupOpen) {
            if (this.keys.W.isDown) {
                this.updateProjectInfo();
            }
        } else if (this.keys.S.isDown) {
            this.updateProjectInfo();
        }

        if (this.keys.W.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play("walk-up", true);
            this.lastDirection = "up";
        } else if (this.keys.S.isDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play("walk-down", true);
            this.lastDirection = "down";
        } else if (this.keys.A.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play("walk-left", true);
            this.lastDirection = "left";
        } else if (this.keys.D.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play("walk-right", true);
            this.lastDirection = "right";
        } else {
            this.player.anims.stop();
            const idleFrames = {
                down: 0,
                left: 4,
                right: 8,
                up: 12,
            };

            this.player.setFrame(idleFrames[this.lastDirection]);
        }

        const body = this.player.body;

        if (body instanceof Physics.Arcade.Body && body.velocity.length() > 0) {
            body.velocity.normalize().scale(speed);
        }

        this.interactionText.setVisible(
            this.isNearComputer && !this.isPopupOpen,
        );
        this.interactionText.setPosition(
            this.computerZone.x,
            this.computerZone.y - 20,
        );

        this.isNearComputer = this.physics.overlap(
            this.player,
            this.computerZone,
        );

        if (this.isNearComputer && Input.Keyboard.JustDown(this.keys.E)) {
            console.log("computer interaction!");
            this.isPopupOpen = true;
            console.log("isPopupOpen?", this.isPopupOpen);

            this.portfolioPopup.setVisible(true);
        }

        if (this.isPopupOpen) {
            this.player.setVelocity(0);
            this.player.anims.stop();
            return;
        }
    }
}

