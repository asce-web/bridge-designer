/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { environment } from '../../../environments/environment';

export class Version {
  private constructor(
    public readonly major: number,
    public readonly minor: number,
    public readonly build: number,
    public readonly mod: string = '',
  ) {}

  public static fromPackageVersion(version: string, mod: string): Version {
    const [major, minor, build] = version.split('.').map(digits => parseInt(digits));
    return new Version(major, minor, build, mod);
  }

  /** Returns 4-digit build number. Local storage key salt for dehydration. NEVER GOES BACKWARD! */
  public get buildNumber(): string {
    return `${String(this.build).padStart(4, '0')}`;
  }

  /** Returns a standard version string with fixed-width build number. */
  public toString(): string {
    return `${this.major}.${this.minor}.${this.buildNumber}${this.mod}`;
  }
}

export const VERSION = Version.fromPackageVersion(environment.version, environment.versionMod);
