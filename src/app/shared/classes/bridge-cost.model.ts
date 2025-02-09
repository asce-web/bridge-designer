import { TreeMap } from '../core/tree-map';
import { CrossSection, Material, Shape } from '../services/inventory.service';
import { DOLLARS_FORMATTER } from './utility';

/** Accumulator for report line denoting a material+section with corresponding total truss weight in kilograms. */
export class MaterialSectionWeight {
  public memberKg: number = 0;
  public readonly name: string;
  public readonly trackingTag: string;

  constructor(
    public readonly material: Material,
    public readonly section: CrossSection,
  ) {
    this.name = `${this.material.name} ${this.section.name.toLowerCase()}`;
    this.trackingTag = `${this.material.name}|${this.section.name.toLowerCase()}|${this.memberKg.toFixed(2)}`;
  }

  public get costTablulation(): string {
    return `(${this.memberKg.toFixed(2)} kg) × (\$${this.material.cost[this.section.index]}) × (2 trusses)`;
  }

  public get cost(): string {
    return DOLLARS_FORMATTER.format(this.memberKg * this.material.cost[this.section.index] * 2);
  }
}

export class SizeMaterialSectionCount {
  public count: number = 0;
  public readonly name: string;

  constructor(
    public readonly shape: Shape,
    public readonly material: Material,
  ) {
    this.name = `${shape.name}mm ${material.name} ${shape.section.shortName}`;
  }
}

/** Summary of bridge costs. */
export class BridgeCostModel {
  constructor(
    public readonly weightByMaterialAndSection: TreeMap<string, MaterialSectionWeight>,
    public readonly countBySizeMaterialAndSection: TreeMap<string, SizeMaterialSectionCount>,
    public readonly connectionCount: number,
  ) {}
}
