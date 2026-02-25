/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { TestBed } from '@angular/core/testing';
import { ContestParametersService, WindowLocation } from './contest-parameters.service';

describe('ContestParametersService', () => {
  let service: ContestParametersService;

  let setUpService = (search: string = '') => {
    const windowLocationSpy = jasmine.createSpyObj('WindowLocation', [], {value: { search }});
    TestBed.configureTestingModule({
      providers: [ContestParametersService, 
        {provide: WindowLocation, useValue: windowLocationSpy}
      ]
    });
    service = TestBed.inject(ContestParametersService);
  }

  it('should initialize with default parameters', () => {
    setUpService();

    expect(service.parameters.anchorageCost).toBe(6000);
    expect(service.parameters.bridgeVersion).toBe(2024);
    expect(service.parameters.carbonSteelCostPerKg).toEqual([4.3, 6.3]);
    expect(service.parameters.connectionFee).toBe(400);
    expect(service.parameters.encryptionKey).toBe('');
  });

  it('should generate search string without encoding as raw JSON', () => {
    setUpService();
    const rawJson = service.toSearchString(true);
    const parsed = JSON.parse(rawJson);

    expect(parsed.a).toBe(6000); // anchorageCost alias
    expect(parsed.v).toBe(2024); // bridgeVersion alias
    expect(parsed.sc).toEqual([4.3, 6.3]); // carbonSteelCostPerKg alias
  });

  it('should generate search string with encoding as URI parameter', () => {
    setUpService();
    const encoded = service.toSearchString(false);

    expect(encoded).toMatch(/^\?p=/);

    const decodedPart = decodeURIComponent(encoded.substring(3));
    const parsed = JSON.parse(decodedPart);

    expect(parsed.a).toBe(6000);
  });

  it('should patch parameters from URL search parameter', () => {
    const patch = JSON.stringify({ a: 7000, v: 2025 })
    setUpService(`?p=${encodeURIComponent(patch)}`);   

    expect(service.parameters.anchorageCost).toBe(7000);
    expect(service.parameters.bridgeVersion).toBe(2025);
    expect(service.parameters.connectionFee).toBe(400); // unchanged
  });

  it('should handle invalid JSON in patch gracefully', () => {
    setUpService('?p=invalid%20json');
    
    expect(service.parameters.anchorageCost).toBe(6000); // defaults remain
  });

  it('should support patching array parameters', () => {
    const patch = JSON.stringify({ ah: [150, 150], as: [80, 190] });
    setUpService(`?p=${encodeURIComponent(patch)}`);   
    
    expect(service.parameters.heavyAxleLoads).toEqual([150, 150]);
    expect(service.parameters.standardAxleLoads).toEqual([80, 190]);
  });

  it('should support patching string parameters', () => {
    const patch = JSON.stringify({ k: 'secretKey123' });
    setUpService(`?p=${encodeURIComponent(patch)}`);   
    
    expect(service.parameters.encryptionKey).toBe('secretKey123');
  });

  it('should round-trip parameters through search string', () => {
    setUpService();
    service.parameters.anchorageCost = 8000;
    service.parameters.bridgeVersion = 2026;    
    const searchString = service.toSearchString(true);
    const parsed = JSON.parse(searchString);
    
    expect(parsed.a).toBe(8000);
    expect(parsed.v).toBe(2026);
  });
});