/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { TestBed } from '@angular/core/testing';
import { ContestParametersService, SearchStringProvider } from './contest-parameters.service';

describe('ContestParametersService', () => {
  let service: ContestParametersService;

  function setUpService(search: string = '') {
    const windowLocationSpy = jasmine.createSpyObj('SearchStringProvider', [], {
      verbose: true,
      value: search,
    });
    TestBed.configureTestingModule({
      providers: [ContestParametersService, { provide: SearchStringProvider, useValue: windowLocationSpy }],
    });
    service = TestBed.inject(ContestParametersService);
  }

  it('initializes with the default parameters', () => {
    setUpService();
    expect(service.parameters).toEqual(
      jasmine.objectContaining({
        anchorageCostPer: 6000,
        bridgeVersion: 2024,
        carbonSteelCostPerKg: [4.3, 6.3],
        connectionFee: 400,
        encryptionKey: '',
      }),
    );
    expect(service.parameters.isPatched).toBeFalse();
    expect(service.parameters.version).toBe(1);
  });

  it('toSearchString produces aliased JSON', () => {
    setUpService();
    const json = service.toSearchString();
    const parsed = JSON.parse(json);
    expect(parsed.a).toBe(6000); // anchorageCost
    expect(parsed.vb).toBe(2024); // bridgeVersion
    expect(parsed.sc).toEqual([4.3, 6.3]); // carbonSteelCostPerKg
    expect(Object.keys(parsed)).toContain('k'); // encryptionKey alias present
  });

  it('fromSearchString restores a parameter object', () => {
    setUpService();
    const aliased = JSON.stringify({ a: 1234, _v: 9, k: 'foo' });
    const params = service.fromSearchString(aliased);
    expect(params.anchorageCostPer).toBe(1234);
    expect(params.version).toBe(9);
    expect(params.encryptionKey).toBe('foo');
  });

  it('ignores patches to internal-only fields', () => {
    setUpService(JSON.stringify({ _v: 9999, _i: false }));
    expect(service.parameters.version).toBe(1);
    expect(service.parameters.isPatched).toBe(true);
  });

  it('logs an error and leaves defaults when the patch JSON is invalid', () => {
    spyOn(console, 'error');
    setUpService('not json');
    expect(console.error).toHaveBeenCalledWith('contest parameter patch not applied', jasmine.anything(), 'not json');
    expect(service.parameters.anchorageCostPer).toBe(6000);
    expect(service.parameters.isPatched).toBeFalse();
  });

  it('rejects a patch with the wrong type without modifying defaults', () => {
    spyOn(console, 'error');
    const patch = JSON.stringify({ a: 'oops' });
    setUpService(patch);
    expect(console.error).toHaveBeenCalledWith('contest parameter patch not applied', jasmine.anything(), patch);
    expect(service.parameters.anchorageCostPer).toBe(6000);
    expect(service.parameters.isPatched).toBeFalse();
  });

  it('supports patching array parameters', () => {
    setUpService(JSON.stringify({ xh: [150, 150], xs: [80, 190] }));
    expect(service.parameters.heavyAxleLoads).toEqual([150, 150]);
    expect(service.parameters.standardAxleLoads).toEqual([80, 190]);
  });

  it('supports patching string parameters', () => {
    setUpService(JSON.stringify({ k: 'secretKey123' }));
    expect(service.parameters.encryptionKey).toBe('secretKey123');
  });

  it('round‑trips modified parameters through toSearchString', () => {
    setUpService();
    service.parameters.anchorageCostPer = 8000;
    service.parameters.bridgeVersion = 2026;
    const search = service.toSearchString();
    const parsed = JSON.parse(search);
    expect(parsed.a).toBe(8000);
    expect(parsed.vb).toBe(2026);
  });
});
