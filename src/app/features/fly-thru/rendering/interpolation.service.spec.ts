import { InterpolationService, Interpolator } from './interpolation.service';
import { BridgeService } from '../../../shared/services/bridge.service';
import { AnalysisService } from '../../../shared/services/analysis.service';
import { SimulationStateService } from './simulation-state.service';
import { TerrainModelService, CenterlinePost } from '../models/terrain-model.service';
import { vec2 } from 'gl-matrix';
import { projectLocalMatchers } from '../../../shared/test/jasmine-matchers';

describe('InterpolationService', () => {
  let bridgeService: jasmine.SpyObj<BridgeService>;
  let analysisService: jasmine.SpyObj<AnalysisService>;
  let parametersService: jasmine.SpyObj<SimulationStateService>;
  let terrainModelService: jasmine.SpyObj<TerrainModelService>;
  let service: InterpolationService;
  let interpolator: Interpolator;

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
      },
    });

    analysisService = jasmine.createSpyObj('AnalysisService', ['getJointDisplacement', 'getJointDisplacementX']);
    parametersService = { exaggeration: 1 };
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

    analysisService.getJointDisplacementX.and.callFake((loadCase: number, index: number) => {
      return analysisService.getJointDisplacement(vec2.create(), loadCase, index)[1];
    });

    terrainModelService.getRoadCenterlinePostAtX.and.callFake((post: CenterlinePost, x: number) => {
      post.elevation = x < 0 ? -x : x > 12 ? x - 12 : 0;
      return post;
    });

    service = new InterpolationService(bridgeService, parametersService, terrainModelService);

    interpolator = service.createInterpolator(analysisService);
  });

  it('should return roadway coords if left of the bridge', () => {
    expect(interpolator.withParameter(-4).getWayPoint(vec2.create())).toEqual(vec2.fromValues(-4, 4));
    expect(interpolator.withParameter(-2).getWayPoint(vec2.create())).toEqual(vec2.fromValues(-2, 2));
  });

  it('should return roadway coords if right of the bridge', () => {
    expect(interpolator.withParameter(14).getWayPoint(vec2.create())).toEqual(vec2.fromValues(14, 2));
    expect(interpolator.withParameter(16).getWayPoint(vec2.create())).toEqual(vec2.fromValues(16, 4));
  });

  it('should honor exaggeration for load case zero', () => {
    // Zero force location of joint 0 is (0, 0), so checking exaggeration is simplest here.
    const unExaggeratedJointLocation = interpolator.withParameter(-4).getDisplacedJointLocation([0, 0], 0);
    parametersService.exaggeration = 2;
    const exaggeratedJointLocation = interpolator.withParameter(-4).getDisplacedJointLocation([0, 0], 0);
    expect(exaggeratedJointLocation[0]).toBe(2 * unExaggeratedJointLocation[0]);
    expect(exaggeratedJointLocation[1]).toBe(2 * unExaggeratedJointLocation[1]);
  });

  it('should honor exaggeration for load case on bridge', () => {
    const zeroForceInterpolator = service.createInterpolator(InterpolationService.ZERO_FORCE_JOINT_DISPLACEMENT_SOURCE);
    const zeroForceJointLocation = zeroForceInterpolator.withParameter(6).getDisplacedJointLocation([0, 0], 1);
    const unExaggeratedJointLocation = interpolator.withParameter(6).getDisplacedJointLocation([0, 0], 1);
    parametersService.exaggeration = 2;
    const exaggeratedJointLocation = interpolator.withParameter(6).getDisplacedJointLocation([0, 0], 1);
    const unExaggeratedDisplacement = vec2.sub([0, 0], unExaggeratedJointLocation, zeroForceJointLocation);
    const exaggeratedDisplacement = vec2.sub([0, 0], exaggeratedJointLocation, zeroForceJointLocation);
    // Won't be exactly 2 because the parameter space is distorted by exaggeration.
    expect(exaggeratedDisplacement).toNearlyEqual(vec2.scale([0, 0], unExaggeratedDisplacement, 2), 0.2);
  });

  it('should make a fairly smooth path onto, through, and off the bridge', () => {
    const locations = [];
    for (let x = -2; x <= 14; x += 0.25) {
      locations.push(interpolator.withParameter(x).getWayPoint([0, 0]));
    }
    const expectedPath: [number, number][] = [
      [-2, 2],
      [-1.75, 1.75],
      [-1.5, 1.5],
      [-1.25, 1.25],
      [-1, 1],
      [-0.75, 0.75],
      [-0.5, 0.5],
      [-0.25, 0.25],
      [0, 0],
      [0.25, 0],
      [1, 0.5],
      [1.18, 0.4364],
      [1.36, 0.3656],
      [1.54, 0.2876],
      [1.72, 0.2024],
      [1.9, 0.11],
      [2.08, 0.0104],
      [2.26, -0.0964],
      [2.44, -0.2104],
      [2.62, -0.3316],
      [2.8, -0.46],
      [2.98, -0.5956],
      [3.16, -0.7384],
      [3.34, -0.8884],
      [3.52, -1.046],
      [3.7, -1.21],
      [3.88, -1.382],
      [4.08, -1.44],
      [4.32, -1.266],
      [4.56, -1.1],
      [4.8, -0.94],
      [5.04, -0.7876],
      [5.28, -0.6424],
      [5.52, -0.5044],
      [5.76, -0.3736],
      [6, -0.25],
      [6.24, -0.1336],
      [6.48, -0.0244],
      [6.72, 0.0776],
      [6.96, 0.1724],
      [7.2, 0.26],
      [7.44, 0.3404],
      [7.68, 0.4136],
      [7.92, 0.4796],
      [8.2, 0.5384],
      [8.5, 0.59],
      [8.8, 0.6344],
      [9.1, 0.6716],
      [9.4, 0.7016],
      [9.7, 0.7244],
      [10, 0.74],
      [10.3, 0.7484],
      [10.6, 0.7496],
      [10.9, 0.7436],
      [11.2, 0.7304],
      [11.5, 0.71],
      [11.8, 0.6824],
      [12.1, 0.6476],
      [12.4, 0.6056],
      [12.7, 0.5564],
      [13, 1],
      [13.25, 1.25],
      [13.5, 1.5],
      [13.75, 1.75],
      [14, 2],
    ];
    expect(locations).toNearlyEqual(expectedPath, 1e-3);
  });

  it('should have load rotations that make sense', () => {
    const rotations = [];
    for (let x = 0; x <= 18; x += 0.5) {
      const rotation: vec2 = [0, 0];
      interpolator.withParameter(x).getLoadPosition([0, 0], rotation);
      rotations.push(rotation);
    }
    const expectedRotations: [number, number][] = [
      [0.7071, -0.7071], // 0
      [0.8693, -0.4942], // 1
      [0.8892, -0.4576], // 2
      [0.9055, -0.4244], // 3
      [0.9183, -0.3958], // 4
      [0.9286, -0.3711], // 5
      [0.9363, -0.3513], // 6
      [0.9416, -0.3367], // 7
      [0.9453, -0.3262], // 8
      [0.9385, -0.3453], // 9
      [0.9494, -0.3141], // 10
      [0.9349, -0.3548], // 11
      [0.9689, -0.2473], // 12
      [0.991, -0.1342], // 13
      [0.9999, -0.01273], // 14
      [0.992, 0.1263], // 15
      [0.9548, 0.2971], // 16
      [0.89, 0.4559], // 17
      [0.9118, 0.4107], // 18
      [0.9356, 0.3529], // 19
      [0.956, 0.2935], // 20
      [0.9723, 0.2337], // 21
      [0.9847, 0.1742], // 22
      [0.9934, 0.1151], // 23
      [0.9983, 0.05822], // 24
      [1, 0.00775], // 25
      [0.9964, 0.08456], // 26
      [0.9806, 0.196], // 27
      [0.9495, 0.3137], // 28
      [0.8987, 0.4385], // 29
      [0.8163, 0.5777], // 30
      [0.6717, 0.7408], // 31
      [0.7071, 0.7071], // 32
      [0.7071, 0.7071], // 33
      [0.7071, 0.7071], // 34
      [0.7071, 0.7071], // 35
      [0.7071, 0.7071], // 36
    ];
    expect(rotations).toNearlyEqual(expectedRotations, -1e-3);
  });
});
