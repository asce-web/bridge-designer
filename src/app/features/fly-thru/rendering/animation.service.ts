import { Injectable } from '@angular/core';
import { RenderingService } from './rendering.service';
import { ViewService } from './view.service';
import { EventBrokerService } from '../../../shared/services/event-broker.service';

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
export class AnimationService {
  private clockBaseMillis: number | undefined;
  private lastNowMillis: number | undefined;
  private lastClockMillis: number | undefined;
  private _state: AnimationState = AnimationState.STOPPED;
  private frameTickMillis: number | undefined;
  private frameCount: number = 0;
  private totalRenderMillis: number = 0;

  constructor(
    eventBrokerService: EventBrokerService,
    private readonly renderService: RenderingService,
    private readonly viewService: ViewService,
  ) {
    eventBrokerService.flyThruAnimationPauseRequest.subscribe(info => {
      if (info.data) {
        this.pause();
      } else {
        this.unpause();
      }
    });
  }

  /** Returns the current state of animation. */
  public get state(): AnimationState {
    return this._state;
  }

  /** Starts calls to the registered renderer at the frame rate with clock at zero. */
  public start(): void {
    if (this._state !== AnimationState.STOPPED) {
      return;
    }
    this._state = AnimationState.RUNNING;
    const render = (nowMillis: number): void => {
      if (this._state === AnimationState.STOPPED) {
        return; // Skips scheduling next loop iteration.
      }
      // Handle first frame.
      if (this.lastClockMillis === undefined || this.lastNowMillis === undefined) {
        this.lastClockMillis = this.lastNowMillis = nowMillis;
      }
      // First frame and reset after unpause.
      if (this.clockBaseMillis === undefined) {
        this.clockBaseMillis = nowMillis - this.lastClockMillis;
      }
      const clockMillis =
        this._state === AnimationState.PAUSED ? this.lastClockMillis : nowMillis - this.clockBaseMillis;
      const frameStartMillis = performance.now();
      this.renderService.renderFrame(nowMillis, nowMillis - this.lastNowMillis, clockMillis);
      this.totalRenderMillis += performance.now() - frameStartMillis;
      this.lastClockMillis = clockMillis;
      this.lastNowMillis = nowMillis;

      // Track fps and eye point:
      ++this.frameCount;
      if (!this.frameTickMillis) {
        this.frameTickMillis = nowMillis;
      } else if (nowMillis - this.frameTickMillis > 1000) {
        // TODO: Put this in an overlay div.
        console.log(
          'fps:',
          this.frameCount,
          'eye:',
          this.viewService.eye[0].toFixed(1),
          this.viewService.eye[1].toFixed(1),
          this.viewService.eye[2].toFixed(1),
          'render %:',
          Math.round(this.totalRenderMillis * 0.1), // /1000*100
        );
        this.frameTickMillis = nowMillis;
        this.frameCount = 0;
        this.totalRenderMillis = 0;
      }

      // Schedule next loop iteration.
      requestAnimationFrame(render);
    };
    this.renderService.prepareToRender();
    // Kick off the animation loop. Scheduled so the resize handler can
    // set viewport and projection before first frame is rendered.
    setTimeout(() => requestAnimationFrame(render));
  }

  /** Stops calls to the registered renderer. */
  public stop(): void {
    this._state = AnimationState.STOPPED;
  }

  /** When running, pauses the clock while the renderer is still called at the frame rate. */
  private pause(): void {
    if (this._state !== AnimationState.RUNNING) {
      return;
    }
    this._state = AnimationState.PAUSED;
  }

  /** When paused, upauses the rendering clock. Rendering proceeds at the frame rate. */
  private unpause(): void {
    if (this._state !== AnimationState.PAUSED) {
      return;
    }
    this._state = AnimationState.RUNNING;
    // Reset base so clock will advance from the paused value.
    this.clockBaseMillis = undefined;
  }
}
