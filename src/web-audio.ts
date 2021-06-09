import { LitElement, html, HTMLTemplateResult } from 'lit';
import { property, state } from "lit/decorators.js";

type Constructor<T> = new (...args: any[]) => T;

export declare class WebAudioPlayerInterface {
  src: string;

  isPlaying: Boolean;
  currentTime: number;
  percentDone: number;

  init(audioElement: HTMLAudioElement): void;
  play(): Boolean;
  pause(): Boolean;
  getDuration(): Number;
}

export const WebAudioPlayer =
  <T extends Constructor<LitElement>>(superClass: T) => {
    class WebAudioPlayer extends superClass {
      private currentTimeTracker: any;

      @state()
      isPlaying: Boolean = false;

      @state()
      currentTime: number = 0;

      @state()
      percentDone: number = 0;

      @property({ attribute: false })
      private _audioContext: AudioContext | undefined;

      @property({ attribute: false })
      private _audioElement: HTMLAudioElement | null | undefined;

      @property({ attribute: false })
      private _duration: Number = 0;

      @property({ attribute: true })
      src!: string;

      init(audioElement: HTMLAudioElement) {
        if (!this.src) throw new Error('No audio src url provided.');
        if (!audioElement) throw new Error('No <audio> element ID provided.');

        this._audioElement = audioElement;

        const AudioContext = window.AudioContext;

        if (AudioContext) {
          this._audioContext = new AudioContext();
          console.log(this._audioElement);

          if (this._audioElement instanceof HTMLAudioElement) {
            this._audioElement.src = this.src;
            
            const track = this._audioContext.createMediaElementSource(this._audioElement);
            track.connect(this._audioContext.destination);

            setTimeout(() => {
              if (this._audioElement) {
                this._duration = this._audioElement?.duration;
              }
            }, 10);
          }
        }
      }

      play() {
        if (this._audioContext && this._audioElement) {
          this.audioContextResume();
          this._audioElement.play();
          this.isPlaying = true;

          this.startTimeTracker();

          return this.isPlaying;
        }

        return false;
      }

      pause() {
        if (this._audioContext && this._audioElement) {
          this._audioElement.pause();
          this.isPlaying = false;

          this.endTimeTracker();

          return !this.isPlaying;
        }

        return false;
      }

      audioContextResume(): Boolean {
        if (this._audioContext) {
          if (this._audioContext.state === 'suspended') {
            this._audioContext.resume();
          }
          return this._audioContext.state === 'running'
        }

        return false;
      }

      startTimeTracker() {
        this.currentTimeTracker = setInterval(
          () => {
            this.updateProgress();
          },
          250
        );
      }

      endTimeTracker() {
        clearInterval(this.currentTimeTracker);
      }

      updateProgress() {
        this.updateCurrentTime();
        this.updatePercentDone();
      }

      updateCurrentTime() {
        if (this._audioElement) {
          this.currentTime = this._audioElement.currentTime;
        }
      }
      
      updatePercentDone() {
        if (this._audioElement) {
          let d = this._duration as number;
          this.percentDone = this.currentTime / d * 100;
        }
      }

      getDuration(): Number {
        return this._duration;
      }

      getCurrentTime(): number {
        return this.currentTime;
      }

      getIsPlaying(): Boolean {
        return this.isPlaying;
      }
    }

    return WebAudioPlayer as Constructor<WebAudioPlayerInterface> & T;
  };

