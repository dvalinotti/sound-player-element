import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("sound-player")
export class SoundPlayer extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `
    ];

    @property() name = "Sound Player";

    render() {
        return html`<h1>Hello, ${this.name}</h1>`;
    }
}
