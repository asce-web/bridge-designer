/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { Injectable } from '@angular/core';

export type ProjectionType = 'normal' | 'light' | 'trapezoidal' | 'depth';
const NEXT_PROJECTION: Record<ProjectionType, ProjectionType> = {
  normal: 'light',
  light: 'trapezoidal',
  trapezoidal: 'depth',
  depth: 'normal',
};

export type DebugState = {
  isDisplayingDebugInfo: boolean;
  isIgnoringViewBoundaries: boolean;
  projectionType: ProjectionType;
};

@Injectable({ providedIn: 'root' })
export class KeyboardService {
  public readonly debugState: DebugState = {
    isDisplayingDebugInfo: false,
    isIgnoringViewBoundaries: false,
    projectionType: 'normal',
  };

  /** Handles certain keystrokes for the GL canvas. */
  public handleKey(key: string): void {
    const state = this.debugState;
    switch (key) {
      case 'b':
        state.isIgnoringViewBoundaries = !state.isIgnoringViewBoundaries;
        break;
      case 'd':
        state.isDisplayingDebugInfo = !state.isDisplayingDebugInfo;
        break;
      case 'p':
        state.projectionType = NEXT_PROJECTION[state.projectionType];
        break;
    }
  }
}
