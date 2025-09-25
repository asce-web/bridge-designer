import { Injectable } from '@angular/core';

export type ProjectionType = 'normal' | 'light' | 'trapezoidal' | 'depth';
const NEXT_PROJECTION: Record<ProjectionType, ProjectionType> = {
  normal: 'light',
  light: 'trapezoidal',
  trapezoidal: 'depth',
  depth: 'normal',
};

export type DebugState = {
  projectionType: ProjectionType;
  display: boolean;
};

@Injectable({ providedIn: 'root' })
export class KeyboardService {
  public readonly debugState: DebugState = {
    projectionType: 'normal',
    display: false,
  };

  /** Handles keystrokes for the GL canvas. */
  public handleKey(key: string) {
    const state = this.debugState;
    switch (key) {
      case 'p':
        state.projectionType = NEXT_PROJECTION[state.projectionType];
        break;
      case 'd':
        state.display = !state.display;
        break;
    }
  }
}
