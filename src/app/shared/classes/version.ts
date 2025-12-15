/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import {environment } from '../../../environments/environment';

export class Version {
  private constructor(
    public readonly major: number,
    public readonly minor: number,
    public readonly build: number,
    public readonly mod: string = '',
  ) {}

  public static fromPackageVersion(version: string, mod: string) {
    const [major, minor, build] = version.split('.').map(digits => parseInt(digits));
    return new Version(major, minor, build, mod);
  }

  public toString(): string {
    return `${this.major}.${this.minor}.${String(this.build).padStart(4, '0')}${this.mod}`;
  }
}

export const VERSION = Version.fromPackageVersion(environment.version, environment.versionMod);
