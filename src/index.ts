import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("sound-player")
export class SoundPlayer extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `
    ];

    @property({ attribute: true })
    src!: string;

    @property({ attribute: false })
    _audioContext: AudioContext | undefined;

    @property({ attribute: false })
    _audioElement: HTMLAudioElement | null | undefined;

    @property({ attribute: false })
    _duration: Number = 0;

    @state()
    protected isPlaying: Boolean = false;

    @state()
    protected currentTime: number = 0;

    @state()
    protected timeTracker: any;

    @state()
    protected percentDone: number = 0;

    firstUpdated() {
        super.connectedCallback();

        const AudioContext = window.AudioContext;

        if (AudioContext) {
            this._audioContext = new AudioContext();
            this._audioElement = this.shadowRoot?.querySelector('#audio-el');
    
            if (this._audioElement instanceof HTMLAudioElement) {
                this._audioElement.src = this.src;
                const track = this._audioContext.createMediaElementSource(this._audioElement);
                track.connect(this._audioContext.destination);

                setTimeout(() => {
                    console.log(this._audioElement?.duration);
                    this._duration = this._audioElement?.duration || 0;
                }, 1)
            }
        }
    }

    _handleClickPlay(e: MouseEvent) {
        console.log(e.target);
        this._togglePlayTrack();
    }

    _startTimeTracker() {
        this.timeTracker = setInterval(() => {
            this._updateCurrentTime();
            this._updatePercentDone();
        }, 1000)
    }

    _endTimeTracker() {
        clearInterval(this.timeTracker) 
    }

    _updateCurrentTime() {
        if (this._audioElement) {
            this.currentTime = this._audioElement.currentTime;
        }
    }

    _updatePercentDone() {
        if (this._audioElement) {
            const duration = this._audioElement.duration;
            this.percentDone = (this.currentTime / duration) * 100;
        }
    }

    _togglePlayTrack() {
        if (this._audioContext && this._audioElement) {
            console.log(this._audioContext.state)
            if (this._audioContext.state === 'suspended') {
                this._audioContext.resume();
            }

            if (this.isPlaying) {
                this._audioElement.pause();
                this.isPlaying = false;
                this._endTimeTracker();
            } else {
                this._audioElement.play();
                this.isPlaying = true;
                this._startTimeTracker();
            }

            this._updateCurrentTime();
            this._updatePercentDone();
        }
    }

    _logState() {
        console.log(this._audioContext);
        console.log(this._audioElement?.currentTime);
        console.log(this._audioElement?.duration);
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
            <audio id="audio-el"></audio>
            <p>${this.formatTime(this.currentTime)}</p>
            <input type="range" value=${this.percentDone} readonly>
            <p>${this.formatTime(this._duration as number)}</p>
            <button @click=${this._togglePlayTrack} role="switch">
                ${this.isPlaying ? 'Pause' : 'Play'}
            </button>
            <button @click=${this._logState}>Log State</button>
        `;
    }
}
