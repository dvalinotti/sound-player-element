import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { WebAudioPlayer } from "./web-audio";

@customElement("sound-player")
export class SoundPlayer extends WebAudioPlayer(LitElement) {
    static styles = [
        css`
            :host {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
            :host input {
                margin: 0 0.5rem;
            }
            :host button {
                margin: 0.5rem;
                padding: 0.25rem 0.5rem;
            }
        `
    ];

    @property({ attribute: true })
    id!: string;

    firstUpdated() {
        const audioElement = this.shadowRoot?.querySelector(`#${this.id}`);

        if (!audioElement) throw new Error('<audio> element with provided ID not found in Shadow DOM.');

        this.init(audioElement as HTMLAudioElement);
    }

    shouldUpdate(changedProperties: Map<string | number | symbol, unknown>): boolean {
        return !changedProperties.has('_audioElement') && !changedProperties.has('_audioContext');
    }

    _handleClickPlay() {
        this._togglePlayTrack();
    }

    _togglePlayTrack() {
        if (this.getIsPlaying()) {
            this.pause();
        } else {
            this.play();
        }
    }

    formatTime(seconds: number) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor(seconds / 60);
        const s = Math.round(seconds - (m * 60));

        const hrs = `${h < 10 ? '0' : ''}${h}`;
        const mins = `${m < 10 ? '0' : ''}${m}`;
        const secs = `${s < 10 ? '0' : ''}${s}`;

        return `${hrs}:${mins}:${secs}`;
    }

    render() {
        return html`
            <audio id="${this.id}"></audio>
            <p>${this.formatTime(this.getCurrentTime())}</p>
            <input type="range" value=${this.percentDone} min="0" max="100">
            <p>${this.formatTime(this.getDuration() as number)}</p>
            <button @click=${this._handleClickPlay} role="switch">
                ${this.getIsPlaying() ? '||' : '►'}
            </button>
        `;
    }
}
