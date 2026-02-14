<!-- Copyright (c) 2025-2026 Gene Ressler
     SPDX-License-Identifier: GPL-3.0-or-later -->

# Fly-through load test animation

This document describes the organization of the fly-thru animation feature.

## Overall organization

- **Pane.** The UI component that contains the scene and receives user interactions.
- **Models.** Raw data for items in the scene. Some are static, others computed. See the `/models` directory.
  - Static models are either declared as arrays in respective model files or generated from OBJ files by the Python
    build script.
  - Computed models are produced by services.
- **Rendering.** Logic for rendering models, including interaction with OpenGL.
  - **Meshes.** Converting model data into triangle meshes understood by WebGL shaders. There are three categories.
    These are a little blurry due to the option of using either uniforms or instancing for model transformations. With
    the former, only uniforms need per-frame updates. The mesh is fully static. With the latter, the mesh is static
    except that instance transformations are updated once per frame.
    - **Static.** Created and pushed to the GPA the first time a test animation starts. They don't change. Examples:
      Truck, river, sky box.
    - **Per-design conditions.** Created and pushed to the GPU every time the design conditions for the bridge change.
      Examples: terrain including utility line, abutments and pier.
    - **Per frame.** Created and pushed (at least partially) to the GPU for every frame. The sole example is the bridge
      structure. The approach here is to use a canonical cube model of a member with a 4x4 model transform matrix per
      instance to size and position them. Only these need per-frame updates. The cube is pushed only once.
  - **Projections.** Model, view, and projection transformations that orient objects in the scene and the scene for
    viewing, then map it to the pane.
  - **Uniforms.** Management of WebGL uniform (global) data blocks available to shaders.
- **Shaders.** GLSL vertex and fragment manipulators.

## Coordinate systems

The "global" world coordinate system has

- Origin at the bridge's leftmost deck joint, center of roadway.
- Roadway running along the x-axis.
- Y-axis "up".
- Right-handed Z. When origin is on left bank, axis is pointing toward viewer.

## Objects in the animation

The animation scene consists of the following:

- Parallel, camera-independent light source (simulated sunlight)
- Terrain
  - Regular grid, auto-generated.
- River
  - Flat surface with animated texture map depicting flowing water.
  - TODO: Maybe add surface waves.
- Electrical transmission line.
  - Tower.
  - Wires.
- Bridge abutments and optional pier.
- Roadway with shoulder.
- Bridge structure with deck and wear surface.
  - Updates dynamically with animation.
- Truck
  - Rotating wheels.
  - Constrained to roadway and bridge deck wear surface..
  - Fades in on approach to bridge and out on exit
- Wind turbine.
  - Rotating blades.
- Sky box at infinity. Has no model.

## Models

Each object in the animation has an underlying model. These may be stored explicitly or generated programmatically.
Static models don't change during the animation. Dynamic ones change geometry or texture mappings per frame.

| Object                  | Generation   | Kind    | Notes                                                                         |
| ----------------------- | ------------ | ------- | ----------------------------------------------------------------------------- |
| Bridge abutments & pier | Programmatic | Static  | Height varies with scenario. Texture-mapped surfaces. Abutment in 2 copies.   |
| Bridge structure        | Programmatic | Dynamic | Joint offsets and color vary per frame.                                       |
| River                   | Stored       | Dynamic | Animated texture.                                                             |
| Terrain and roadway     | Programmatic | Static  | Diamond algorithm. Varies with design conditions. Erosion coloring per slope. |
| Transmission like wine  | Programmatic | Static  | Catenary sag.                                                                 |
| Transmission line tower | Stored       | Static  | OBJ file. Four copies.                                                        |
| Truck body              | Stored       | Static  | Multiple colors. Translate and rotate.                                        |
| Wheels                  | Programmatic | Dynamic | Rotate and translate in 4 copies. Extra tire for dual rears.                  |
| Wind turbine rotor      | Stored       | Dynamic | OBJ file. Simple rotation.                                                    |
| Wind turbine tower      | Stored       | Static  | OBJ file.                                                                     |

## Transformations

A fairly standard pipeline for everything except the sky box and UI overlays. There are notrs about these in the shaders
README.

### Model coordinates

Model-specific coordinate systems simplify creation logic for computed models and tool usage for static models. Model
transformations reconcile them to global world coordinates.

| Object                  | Origin                        | Orientation                                    |
| ----------------------- | ----------------------------- | ---------------------------------------------- |
| Bridge abutments & pier | Supported joint               | Left abutment of bridge extending along x axis |
| Bridge structure        | Leftmost deck joint           | Extending along x-axis                         |
| River                   | Front left                    | Same as global with y constant.                |
| Terrain and roadway     | Center post, natural y        | Same as global.                                |
| Transmission line tower | Bottom center of base         | Vertical is y-axis. Arms are along x.          |
| Transmission line wire  | Global base of leftmost tower | In global coords (so N/A).                     |
| Truck body              | Axle level bottom middle      | Chasis center line on x-axis, facing right.    |
| Wheels                  | Center                        | Tire in x-y plane. Axle on z-axis.             |
| Wind turbine rotor      | Rear center of hub            | Front faces positive z-axis.                   |
| Wind turbine tower      | Center of base                | Rotor mount surface faces positive z-axis.     |

### Model matrix

Per-model, rotate to correct orientation. Move to correct origin. The uniform service mimicks the old OpenGL API's
transformation stack.

### View matrix

Orient so camera points down the negative z-axis.

### Projection matrix

Apply perspective to foreshorten objects by distance from camera and clip, including near/far. Scale to clip boundaries
xyz&nbsp;∈&nbsp;[-1..1].

### Viewport transform

Set initially and on window size change.

## Lighting

Simple model to keep load on shaders minimal

- Parallel sunlight
- Ambient lit color is a constant factor of material color
- Specular lit color is always the color of the light
- Standard cos^n Phong specular model

## Vertex shader, common

Used for several models.

### Inputs (coordinate space):

- Position (world)
- Normal (world)
- Material index (int)

### Uniforms/globals:

- Model-View-Projection (MVP) matrix
- Model-View (MV) matrix

### Outputs (cooridnate space):

- Projected vertex position (clip)
- Vertex (view)
- Normal (view)
- Material index (int)

### Calculations:

- outPosition = MVP \* [inPosition, 1]
- outVertex = MV \* inVertex;
- outNormal = vec3(MV \* [inNormal, 0])
- outMaterialIndex = inMaterialIndex

## Fragment shader, common

Used for several models.

### Inputs (coordinate space):

- Vertex (view)
- Normal (view)
- Material index (int)

### Uniforms/globals:

- Materials array
  - Color (RGB)
  - Shininess (float)
- Light
  - Direction (unit; view)
  - Color (RGB)
  - Ambient intensity (float)

### Output

- Fragment color

### Calculations:

- unitInNormal = normalize(inNormal)
- dotNormalLight = dot(unitInNormal, inLight.unitDirection)
- unitReflection = normalize(2 \* dotNormalLight \* unitInNormal - inLight.unitDirection)
- unitEye = normalize(-inVertex)
- material = materials\[inMaterialIndex\]
- specularIntensity = pow(max(dot(unitReflection, unitEye), 0), material.shininess)
- specularColor = specularIntensity \* inLight.color
- diffuseIntensity = clamp(dotNormalLight + inLight.ambientIntensity, 1, 0)
- diffuseColor = material.color \* diffuseIntensity \* inLight.color \* (1 - specularIntensity)
- fragmentColor = specularColor + diffuseColor

## View control

Implemented by `ViewService`. Three modes:

- Walking. Normal POV. Eye point with DOV vector.
  - Walk forward/backward: Advance in/opposite direction-of-view (DOV) with speed control.
  - Turn left/right: Slew DOV left/right with rate control while walking forward/backward.
- Truck.
  - Eye point inside truck cab.
  - Neutral DOV aligned with truck wheelbase.
  - Adjust DOV absolute rotation up/down/left/right wrt neutral.
- Orbit.
  - Automatic after no user interaction.
    - Two passes of truck if bridge is successful.
    - A few seconds if bridge fails.
  - Desired effect is walking a path around the bridge, looking at it from many angles.
  - 3d elliptical path. Major axis is x-axis. Minor is z-axis offset right to center of extent.
  - y follows a few meters above terrain level (including deck).
  - Interpolated by arc length for smoothness.
  - Eye at center of span x-z extent and a few meters above deck.
  - Smooth transition from default view is needed, since that's high above the river for designs with high decks.
    Instant transition to orbit path is jarring. This is implemented by interpolating between the default and orbit view
    during the first few sections of motion.
- Control option not implemented: Eye point and DOV are tethered by springs to control point and vector. This would
  prevent jumpiness when following terrain and avoid the interpolated transition. Too complex. And force integrators can
  always become unstable.
