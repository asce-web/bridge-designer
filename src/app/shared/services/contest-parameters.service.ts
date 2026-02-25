import { Injectable } from '@angular/core';

/** Parameters that can be altered for contests. */
type Parameters = {
  anchorageCost: number;
  bridgeVersion: number;
  carbonSteelCostPerKg: [number, number]; // [bar, tube]
  connectionFee: number;
  deckCostPerPanelHiStrength: number;
  deckCostPerPanelMedStrength: number;
  encryptionKey: string; // empty string means unencrypted
  excavationCostRate: number;
  heavyAxleLoads: [number, number]; // [front, rear]
  lowAlloySteelCostPerKg: [number, number]; // [bar, tube]
  productFee: number;
  quenchedAndTemperedSteelCostPerKg: [number, number]; // [bar, tube]
  standardAbutmentBaseCost: number;
  standardAxleLoads: [number, number]; // [front, rear]
};

@Injectable({ providedIn: 'root' })
export class WindowLocation {
  public readonly value: Location = window.location;
}

@Injectable({ providedIn: 'root' })
export class ContestParametersService {
  public readonly parameters: Parameters;

  // Define this direction to detect duplicate aliases at compile time.
  /** Map from search string short aliases to parameter attribute names. */
  private readonly fieldsByAlias: { [key: string]: string } = {
    a: 'anchorageCost',
    v: 'bridgeVersion',
    sc: 'carbonSteelCostPerKg',
    c: 'connectionFee',
    dh: 'deckCostPerPanelHiStrength',
    dm: 'deckCostPerPanelMedStrength',
    k: 'encryptionKey',
    x: 'excavationCostRate',
    ah: 'heavyAxleLoads',
    sa: 'lowAlloySteelCostPerKg',
    p: 'productFee',
    sq: 'quenchedAndTemperedSteelCostPerKg',
    b: 'standardAbutmentBaseCost',
    as: 'standardAxleLoads',
  } as const;

  /** Map from parameter attribute names to search string short aliases. */  
  private readonly aliasesByField = Object.fromEntries(Object.entries(this.fieldsByAlias).map(([k, v]) => [v, k]));

  constructor(windowLocation: WindowLocation) {
    // Set parameter defaults.
    this.parameters = {
      anchorageCost: 6000,
      bridgeVersion: 2024,
      carbonSteelCostPerKg: [4.3, 6.3],
      connectionFee: 400,
      deckCostPerPanelHiStrength: 5100,
      deckCostPerPanelMedStrength: 4700,
      encryptionKey: '',
      excavationCostRate: 1,
      heavyAxleLoads: [137, 137],
      lowAlloySteelCostPerKg: [5.6, 7.0],
      productFee: 1000,
      quenchedAndTemperedSteelCostPerKg: [6.0, 7.7],
      standardAbutmentBaseCost: 6000,
      standardAxleLoads: [71, 181],
    };
    // Patch with contents of JSON in search parameter "p".
    const patch = new URLSearchParams(windowLocation.value.search).get('p');
    if (patch) {
      try {
        const aliasedEntries = Object.entries(JSON.parse(patch));
        const deAliasedEntries = aliasedEntries.map(([alias, value]) => [this.fieldsByAlias[alias], value]);
        Object.assign(this.parameters, Object.fromEntries(deAliasedEntries));
      } catch (err) {
        console.error('bad contest parameter patch was not applied', patch);
      }
      console.log('effective contest parameters', this.toSearchString(true));
    }
  }

  /**
   * Returns a search string representing the parameters that's either complete and URI-encoded
   * or just the raw JSON if `skipEncoding` is true.
   */
  public toSearchString(skipEncoding?: boolean): string {
    const aliasedEntries = Object.entries(this.parameters).map(([field, value]) => [this.aliasesByField[field], value]);
    const rawJson = JSON.stringify(Object.fromEntries(aliasedEntries));
    return skipEncoding ? rawJson : `?p=${encodeURIComponent(rawJson)}`;
  }
}
