import { TestBed } from '@angular/core/testing';
import { PierModelService } from './pier-model.service';
import { projectLocalMatchers } from '../../../shared/test/jasmine-matchers';
import { BridgeService } from '../../../shared/services/bridge.service';

describe('PierModelService', () => {
  let service: PierModelService;
  let bridgeServiceSpy: jasmine.SpyObj<BridgeService>;

  beforeEach(() => {
    jasmine.addMatchers(projectLocalMatchers);
    bridgeServiceSpy = jasmine.createSpyObj('BridgeService', [], {
      bridgeHalfWidth: 8,
      designConditions: {
        pierHeight: 10,
      },
    });
    TestBed.configureTestingModule({
      providers: [PierModelService, { provide: BridgeService, useValue: bridgeServiceSpy }],
    });
    service = TestBed.inject(PierModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected mesh', () => {
    const mesh = service.buildMeshDataForPier();
    const lastIndex = mesh.texturedMeshData.positions.length - 1;
    // The last position should be populated with non-zero.
    expect(mesh.texturedMeshData.positions[lastIndex]).withContext('positions').not.toBe(0);
    // The last normals is parallel to the x-axis.
    expect(mesh.texturedMeshData.normals![lastIndex - 2])
      .withContext('normals')
      .not.toBe(0);
  });
});
