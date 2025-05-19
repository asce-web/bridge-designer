import { Injectable } from '@angular/core';

export type FrameRenderer = (clockMillis: number, elapsedMillis: number) => void;

export const enum AnimationState {
  STOPPED,
  RUNNING,
  PAUSED,
}

/**
 * Container for general purpose logic that starts, runs, and pauses/unpauses an animation.
 *                              ,-------.
 *                              v       |
 * A state machine: STOPPED -> RUN--->PAUSE. Attempts to make other transitions are ignored.
 *                     ^        |       |
 *                     '--------'<------'
 */
@Injectable({ providedIn: 'root' })
export class AnimatorService {
  private clockBaseMillis: number = 0;
  private lastClockMillis: number = 0;
  private _state: AnimationState = AnimationState.STOPPED;
  private renderFrame: FrameRenderer = (_clock, _elapsed) => {};

  /** Returns the current state of animation. */
  public get state(): AnimationState {
    return this._state;
  }

  /**
   * Registers the frame renderer, one for the service. The renderer is passed the
   * current value of the 0-based millisecond clock and time elapsed since the last call.
   */
  public registerRenderer(renderFrame: FrameRenderer) {
    this.renderFrame = renderFrame;
  }

  /** Starts calls to the registered renderer at the frame rate with clock at zero. */
  public start(): void {
    if (this._state !== AnimationState.STOPPED) {
      return;
    }
    this.resetClock();
    this._state = AnimationState.RUNNING;
    this.lastClockMillis = this.clockBaseMillis;
    const render = (nowMillis: number): void => {
      if (this._state === AnimationState.STOPPED) {
        return; // Skips scheduling next loop iteration.
      }
      const clockMillis =
        this._state === AnimationState.PAUSED ? this.lastClockMillis : nowMillis - this.clockBaseMillis;
      this.renderFrame(clockMillis, clockMillis - this.lastClockMillis);
      this.lastClockMillis = clockMillis;
      // Schedule next loop iteration.
      requestAnimationFrame(render);
    };
    // Kick off the animation loop.
    requestAnimationFrame(render);
  }

  /** When running, pauses the clock while the renderer is still called at the frame rate. */
  public pause(): void {
    if (this._state !== AnimationState.RUNNING) {
      return;
    }
    this._state = AnimationState.PAUSED;
  }

  /** When paused, upauses the rendering clock. Rendering proceeds at the frame rate. */
  public unpause(): void {
    if (this._state !== AnimationState.PAUSED) {
      return;
    }
    this._state = AnimationState.RUNNING;
    // Reset base so clock will advance from the paused value.
    this.clockBaseMillis = Date.now() - this.lastClockMillis;
  }

  /** Stops calls to the registered renderer. */
  public stop(): void {
    this._state = AnimationState.STOPPED;
  }

  /** Reset the simulation clock to zero, regardless of state. */
  public resetClock(): void {
    this.clockBaseMillis = Date.now();
  }
}
