import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.cameras.main.setBackgroundColor("#000000");
        // this.background = this.add.image(512, 384, "background");
        // this.logo = this.add.image(512, 300, "logo").setDepth(100);
        // this.title = this.add
        //     .text(512, 460, "Main Menu", {
        //         fontFamily: "Arial Black",
        //         fontSize: 38,
        //         color: "#ffffff",
        //         stroke: "#000000",
        //         strokeThickness: 8,
        //         align: "center",
        //     })
        //     .setOrigin(0.5)
        //     .setDepth(100);
        const centerX = this.cameras.main.centerX;

        const nameText = this.add
            .text(centerX, 280, "", {
                fontSize: "20px",
                color: "#ffffff",
                fontFamily: "monospace",
            })
            .setOrigin(0.5);

        const roleText = this.add
            .text(centerX, 320, "", {
                fontSize: "14px",
                color: "#ffffff",
                fontFamily: "monospace",
            })
            .setOrigin(0.5);

        const portfolioText = this.add
            .text(centerX, 350, "", {
                fontSize: "14px",
                color: "#ffffff",
                fontFamily: "monospace",
            })
            .setOrigin(0.5);

        const enterButton = this.add
            .text(centerX, 410, "> ENTER WORKROOM", {
                fontSize: "14px",
                color: "#ffffff",
                fontFamily: "monospace",
            })
            .setOrigin(0.5)
            .setVisible(false)
            .setAlpha(1)
            .setInteractive({ useHandCursor: true });

        const typeText = (
            textObject: Phaser.GameObjects.Text,
            fullText: string,
            callback?: () => void,
        ) => {
            let index = 0;

            this.time.addEvent({
                delay: 70,
                repeat: fullText.length - 1,
                callback: () => {
                    index++;
                    textObject.setText(fullText.slice(0, index));

                    if (index === fullText.length) {
                        callback?.();
                    }
                },
            });
        };
        this.time.delayedCall(500, () => {
            typeText(nameText, "YANG SUYEON", () => {
                this.time.delayedCall(200, () => {
                    typeText(roleText, "FRONTEND DEVELOPER", () => {
                        this.time.delayedCall(200, () => {
                            typeText(portfolioText, "PORTFOLIO", () => {
                                // 여기까지 왔는지 확인
                                // console.log("typing finished");

                                this.time.delayedCall(400, () => {
                                    enterButton.setVisible(true);

                                    this.tweens.add({
                                        targets: enterButton,
                                        alpha: 0,
                                        duration: 600,
                                        yoyo: true,
                                        repeat: 1,

                                        onComplete: () => {
                                            enterButton.setAlpha(1);
                                        },
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Workroom");
    }

    moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback) {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}

