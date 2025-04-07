export class Version {
  constructor(
    public readonly major: number,
    public readonly minor: number,
    public readonly build: number,
    public readonly mod: string = '',
  ) {}

  public toString(): string {
    return `${this.major}.${this.minor}.${String(this.build).padStart(4, '0')}${this.mod}`;
  }
}

export const VERSION = new Version(25, 0, 0, '-beta');
