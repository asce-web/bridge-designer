/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { BridgeModel } from '../classes/bridge.model';
import { Point2DInterface } from '../classes/graphics';
import { Joint } from '../classes/joint.model';

/** Returns a list of structure violations of the given bridge. Empty is good. */
export function validateBridge(bridge: BridgeModel): string[] {
  const problems = [];
  const joints = bridge.joints;
  const jointSet = new Set<Joint>();
  const jointCount = joints.length;
  for (let i = 0; i < jointCount; ++i) {
    if (jointSet.has(joints[i])) {
      problems.push(`duplicate joint ${joints[i]}`);
    }
    jointSet.add(joints[i]);
  }
  const members = bridge.members;
  const memberCount = members.length;
  for (let i = 0; i < jointCount; ++i) {
    if (joints[i].index !== i) {
      problems.push(`joint at ${i} has .index ${joints[i].index}`);
    }
  }
  for (let i = 0; i < memberCount; ++i) {
    if (members[i].index !== i) {
      problems.push(`member at ${i} has .index ${members[i].index}`);
    }
  }
  const memberKeySet = new Set<string>();
  for (let i = 0; i < memberCount; ++i) {
    const key = members[i].key;
    if (memberKeySet.has(key)) {
      problems.push(`duplicate member key ${key}`);
    }
    memberKeySet.add(key);
    if (members[i].a === members[i].b) {
      problems.push(`member at ${i} has duplicate joints ${members[i].a}`);
    }
    if (!jointSet.has(members[i].a)) {
      problems.push(`member at ${i} .a refers to external joint ${members[i].a}`);
    }
    if (!jointSet.has(members[i].b)) {
      problems.push(`member at ${i} .b refers to external joint ${members[i].b}`);
    }
  }
  return problems;
}

/** Returns a list of concave vertices in a supposedly convex hull. */
export function validateConvexHull(hull: Point2DInterface[]): number[] {
  const bad = [];
  for (let i = 0; i < hull.length; ++i) {
    const a = hull[i === 0 ? hull.length - 1 : i - 1];
    const b = hull[i];
    const c = hull[i === hull.length - 1 ? 0 : i + 1];
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const wx = c.x - b.x;
    const wy = c.y - b.y;
    if (vx * wy - wx * vy < 0) {
      bad.push(i);
    }
  }
  return bad;
}
