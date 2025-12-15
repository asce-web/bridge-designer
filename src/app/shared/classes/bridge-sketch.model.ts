/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { DesignConditions, DesignConditionsService } from "../services/design-conditions.service";
import { Point2DInterface } from "./graphics";

export type SketchMember = {
  a: Point2DInterface;
  b: Point2DInterface;
}

export class BridgeSketchModel {
  /** A placeholder denoting no bridge sketch model. */
  public static readonly ABSENT = new BridgeSketchModel('[none]');

  public readonly joints: Point2DInterface[] = [];
  public readonly members: SketchMember[] = [];

  constructor(public readonly name: string, public readonly designConditions: DesignConditions = DesignConditionsService.PLACEHOLDER_CONDITIONS) {}
}
