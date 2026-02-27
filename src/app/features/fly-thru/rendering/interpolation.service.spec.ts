/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { InterpolationService, Interpolator } from './interpolation.service';
import { BridgeService } from '../../../shared/services/bridge.service';
import { AnalysisService } from '../../../shared/services/analysis.service';
import { TerrainModelService, CenterlinePost } from '../models/terrain-model.service';
import { vec2 } from 'gl-matrix';
import { projectLocalMatchers } from '../../../shared/ts-test/jasmine-matchers';
import { SiteConstants } from '../../../shared/classes/site-constants';
import { FlyThruSettingsService } from './fly-thru-settings.service';

describe('InterpolationService', () => {
  let bridgeService: jasmine.SpyObj<BridgeService>;
  let analysisService: jasmine.SpyObj<AnalysisService>;
  let collapseAnalysisService: jasmine.SpyObj<AnalysisService>;
  let settings: { exaggeration: number };
  let settingsService: jasmine.SpyObj<FlyThruSettingsService>;
  let terrainModelService: jasmine.SpyObj<TerrainModelService>;
  let service: InterpolationService;
  let interpolator: Interpolator;
  const load = vec2.create();
  const rotation = vec2.create();

  beforeEach(() => {
    jasmine.addMatchers(projectLocalMatchers);
    bridgeService = jasmine.createSpyObj('BridgeService', [], {
      designConditions: { loadedJointCount: 4 },
      bridge: {
        joints: [
          { x: 0, y: 0 },
          { x: 4, y: 0 },
          { x: 8, y: 0 },
          { x: 12, y: 0 },
        ],
        members: [{}, {}, {}, {}, {}, {}],
      },
    });

    analysisService = jasmine.createSpyObj('AnalysisService', [
      'getJointDisplacement',
      'getJointDisplacementX',
      'getMemberForce',
      'getMemberTensileStrength',
    ]);
    collapseAnalysisService = jasmine.createSpyObj('AnalysisService', [
      'getJointDisplacement',
      'getJointDisplacementX',
    ]);
    settings = { exaggeration: 1 };
    settingsService = settings as FlyThruSettingsService;
    terrainModelService = jasmine.createSpyObj('TerrainModelService', ['getRoadCenterlinePostAtX']);

    analysisService.getJointDisplacement.and.callFake((out: vec2, loadCase: number, index: number) => {
      const deadLoadDisplacements = [
        [1, 1],
        [0, -1],
        [0, 1],
        [1, 1],
      ];
      const dld = deadLoadDisplacements[index];
      out[0] = dld[0];
      out[1] = loadCase === index ? dld[1] - 0.5 : dld[1];
      return out;
    });

    analysisService.getMemberForce.and.callFake((ilc: number, im: number): number => ilc * 10 + im);

    analysisService.getMemberTensileStrength.and.callFake((im: number): number => im * 100);

    analysisService.getJointDisplacementX.and.callFake((loadCase: number, index: number) => {
      return analysisService.getJointDisplacement(vec2.create(), loadCase, index)[1];
    });

    terrainModelService.getRoadCenterlinePostAtX.and.callFake((post: CenterlinePost, x: number) => {
      post.elevation = (x < 0 ? -x : x > 12 ? x - 12 : 0) + SiteConstants.DECK_TOP_HEIGHT;
      return post;
    });

    service = new InterpolationService(
      analysisService,
      collapseAnalysisService,
      bridgeService,
      settingsService,
      terrainModelService,
    );
    interpolator = service.createAnalysisInterpolator();
  });

  it('should return roadway coords if left of the bridge', () => {
    interpolator.setParameter(-4).getLoadPosition(load, rotation);

    expect(load).toNearlyEqual(vec2.fromValues(-4, 4.8));
    expect(vec2.normalize(rotation, rotation)).toNearlyEqual(vec2.fromValues(0.7071, -0.7071), 1e-3);

    interpolator.setParameter(-2).getLoadPosition(load, rotation);

    expect(load).toNearlyEqual(vec2.fromValues(-2, 2.8));
    expect(vec2.normalize(rotation, rotation)).toNearlyEqual(vec2.fromValues(0.7071, -0.7071), 1e-3);
  });

  it('should return roadway coords if right of the bridge', () => {
    interpolator.setParameter(14).getLoadPosition(load, rotation);

    expect(load).toNearlyEqual(vec2.fromValues(14, 2.8));
    // Rear tire still on the bridge.
    expect(vec2.normalize(rotation, rotation)).toNearlyEqual(vec2.fromValues(0.9568, 0.2909), 1e-3);

    interpolator.setParameter(16).getLoadPosition(load, rotation);

    expect(load).toNearlyEqual(vec2.fromValues(16, 4.8));
    expect(vec2.normalize(rotation, rotation)).toNearlyEqual(vec2.fromValues(0.7071, 0.7071), 1e-3);
  });

  it('should honor exaggeration for load case zero', () => {
    const actualLocations = interpolator.setParameter(-4).getAllDisplacedJointLocations(new Float32Array(8));
    settings.exaggeration = 2;
    const exaggeratedLocations = interpolator.setParameter(-4).getAllDisplacedJointLocations(new Float32Array(8));
    expect(exaggeratedLocations[0]).toBe(2 * actualLocations[0]);
  });

  it('should honor exaggeration for load case on bridge', () => {
    const zeroForceInterpolator = service.createDeadLoadingInterpolator(0);
    const zeroForceLocations = zeroForceInterpolator.setParameter(6).getAllDisplacedJointLocations(new Float32Array(8));

    const actualLocations = interpolator.setParameter(6).getAllDisplacedJointLocations(new Float32Array(8));

    settings.exaggeration = 2;
    const exaggeratedLocations = interpolator.setParameter(6).getAllDisplacedJointLocations(new Float32Array(8));

    const actualDisplacement = vec2.sub([0, 0], actualLocations.slice(2, 2), zeroForceLocations.slice(2, 2));
    const exaggeratedDisplacement = vec2.sub([0, 0], exaggeratedLocations.slice(2, 2), zeroForceLocations.slice(2, 2));
    // Won't be exactly 2 because the parameter space is distorted by exaggeration.
    expect(exaggeratedDisplacement).toNearlyEqual(vec2.scale([0, 0], actualDisplacement, 2), 0.2);
  });

  it('should make a fairly smooth path onto, through, and off the bridge', () => {
    const locations = [];
    const rotations = [];
    for (let x = -1; x <= 14; x += 0.5) {
      const location = vec2.create();
      const rotation = vec2.create();
      interpolator.setParameter(x).getLoadPosition(location, rotation);
      locations.push(location[0], location[1]);
      rotations.push(rotation[0], rotation[1]);
    }
    // prettier-ignore
    const expectedLocations: number[] = [
      -1, 1.7999,
      -0.5, 1.2999,
      0, 0.8000,
      1, 1.2999,
      1.3600, 1.1656,
      1.7200, 1.0024,
      2.0799, 0.8104,
      2.4400, 0.5896,
      2.7999, 0.3400,
      3.1600, 0.0616,
      3.5199, -0.2455,
      3.8800, -0.5816,
      4.3200, -0.4663,
      4.8000, -0.1400,
      5.2800, 0.1575,
      5.7600, 0.4264,
      6.2399, 0.6664,
      6.7199, 0.8776,
      7.1999, 1.0600,
      7.6799, 1.2136,
      8.1999, 1.3384,
      8.8000, 1.4343,
      9.3999, 1.5016,
      10, 1.5399,
      10.6000, 1.5496,
      11.1999, 1.5304,
      11.8000, 1.4823,
      12.3999, 1.4055,
      13, 1.2999,
      13.5, 2.2999,
      14, 2.7999,
    ];
    // prettier-ignore
    const expectedRotations = [
      2.8281, -2.8281,
      2.8281, -2.8281,
      2.8281, -2.8281,
      3.4843, -1.9843,
      3.5631, -1.8375,
      3.6262, -1.7038,
      3.6737, -1.5833,
      3.7212, -1.4916,
      3.7374, -1.3974,
      3.7693, -1.3477,
      3.7856, -1.3112,
      3.0937, -2.5368,
      3.2975, -2.2479,
      3.5862, -1.7689,
      3.7962, -1.2650,
      3.9275, -0.7408,
      4.0024, -0.2178,
      3.9874, 0.3249,
      3.9049, 0.8665,
      3.7549, 1.4026,
      3.7599, 1.3712,
      3.8050, 1.2413,
      3.8499, 1.0661,
      3.9099, 0.8517,
      3.9550, 0.5857,
      4, 0.2743,
      4, -0.1036,
      3.9937, -0.3035,
      3.9750, -0.3975,
      3.9499, 0.6363,
      3.8312, 1.1648249626159668
    ];
    expect(locations).withContext('locations').toNearlyEqual(expectedLocations, -1e-3);
    expect(rotations).withContext('rotations').toNearlyEqual(expectedRotations, -1e-3);
  });
});
