import { vec4 } from "gl-matrix";

export const UNIT_LIGHT_DIRECTION = vec4.fromValues(0.0572181596, 0.68661791522, 0.72476335496, 0);

// WebGL minimum is 8 texture units.
export const OVERLAY_TEXTURE_UNIT = 0;
export const WATER_TEXTURE_UNIT = 1;
export const SKYBOX_TEXTURE_UNIT = 2;
export const FACIA_TEXTURE_UNIT = 3;
export const DEPTH_TEXTURE_UNIT = 4;
