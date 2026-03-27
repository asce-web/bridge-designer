/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { TestBed } from '@angular/core/testing';
import { GussetsService } from './gussets.service';
import { BridgeService } from './bridge.service';
import { ConvexHullService } from './convex-hull.service';
import { Joint } from '../classes/joint.model';
import { Member } from '../classes/member.model';
import { Point2DInterface } from '../classes/graphics';
import { projectLocalMatchers } from '../ts-test/jasmine-matchers';

describe('GussetsService', () => {
  let service: GussetsService;
  let bridgeServiceSpy: jasmine.SpyObj<BridgeService>;

  const jointA = { x: 0, y: 0, index: 0 } as Joint;
  const jointB = { x: 1, y: 1, index: 1 } as Joint;
  const jointC = { x: 2, y: 0, index: 2 } as Joint;
  const memberAB = buildTestMember(jointA, jointB, 100);
  const memberBC = buildTestMember(jointB, jointC, 200);
  const memberCA = buildTestMember(jointC, jointA, 300);
  const expectedHull: Point2DInterface[] = [
    { x: 0.269, y: 0.17 },
    { x: 0.17, y: 0.269 },
    { x: -0.17, y: 0.17 },
    { x: -0.17, y: -0.17 },
    { x: 0.269, y: -0.17 },
  ];

  beforeEach(() => {
    jasmine.addMatchers(projectLocalMatchers);
    bridgeServiceSpy = jasmine.createSpyObj('BridgeService', [], {
      bridge: {
        joints: [jointA, jointB, jointC],
        members: [memberAB, memberBC, memberCA],
      },
    });

    TestBed.configureTestingModule({
      providers: [GussetsService, ConvexHullService, { provide: BridgeService, useValue: bridgeServiceSpy }],
    });
    service = TestBed.inject(GussetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate gussets for each joint', () => {
    const gussets = service.createGussets();
    expect(gussets.length).toBe(3);
    gussets.forEach((gusset, idx) => {
      expect(gusset.joint.index).toBe(idx);
      expect(Array.isArray(gusset.hull)).toBeTrue();
      expect(gusset.halfDepthM).toBeGreaterThan(0.1);
      expect(gusset.hull.length).toBeGreaterThan(0);
    });
  });

  it('should produce expected gusset contents', () => {
    const gusset = service.createGussets()[0];
    expect(gusset.joint).toEqual(jointA);
    expect(gusset.halfDepthM).toBeCloseTo(0.17);
    expect(gusset.hull).toNearlyEqual(expectedHull, 1e-3);
  });

  function buildTestMember(a: Joint, b: Joint, materialSizeMm: number): Member {
    return { a, b, materialSizeMm, getOtherJoint: (j: Joint) => (j === a ? b : a) } as Member;
  }
});
