# Shaders

This directory contains shader code, a simple build system, and a service to provide compiled shader programs.

## Shader code

Add a file with suffix `.vert` or `.frag` for a vertex or fragment shader respectively. The build script will find it
and add it to `shaders.ts`.

## Builder

The script `build.py` adds the content of each shader program as a string constant in `shaders.ts`. It also honors
include directives of the form:

```
// build_include "include_file_name"
```

These can be nested up to three deep. Included content is ignored for purposes of OpenGL error line numbers.

If option `--compress` is given, `shaders.ts` strings will contain much less whitespace.

## Compilation and linking

All the shaders in `shaders.ts` are compiled at once by the service endpoint `compileShaders()` and returned in a map
keyed by the original shader source file name stem.

Vertex/fragment shader pairs are linked into programs by `linkPrograms()` based on a data table defined there.

The public method `buildPrograms()` performs the compile and link steps and caches the results, after which a call ot
`getProgram(name)` will work. Otherwise a toast error is thrown.

TODO: This could all be done lazily to save graphic card resources if the animation is never run.

## Checklist for adding a new shader (or deleting one).

- Add `.vert` and/or `.frag` files in this directory.
- Add a `ProgramSpec` to the table in `shader.service.ts`.
- For new uniform blocks, follow the pattern for existing ones in `uniform.service.ts`.
- If any existing uniform blocks are used by the new shaders, update `uniform.service.ts`:
  - Add a new shader lookup at the top of `prepareUniforms`.
  - Update or add calls to `setUpUniformBlock`, i.e. the list of affected programs.

## Sky box

The transformations were a bit hard to visualize, so some notes.

The sky box is defined around the origin. For visibility when culling, its triangles must be CCW from the inside.

The trick is that we replace the normal MVP transform while drawing the box. We want the sky box to appear infinitely
far away. I.e., the visible swatch of the box's inside depends only on view _direction_. Viewing position has no effect.
If we just translate the normal MVP view frustum apex to the origin, the swatch will be correct. As the viewer turns
their head, the frustum swivels, and the swatch changes accordingly. As they translate, the swatch stays the same.

With this view frustum, the size of the box doesn't matter because:

- Scaling with respect to the origin, where the eye is, causes no change to the perspective view, and
- The depth check is forced to pass by ensuring the z-coordinate after perspective division is one. This entails copying
  w of the final vertex position to z (depth).

Online discussions don't tell the story above. They just show as an afterthought that you magically get the required
view by coercing the normal V to a 3x3 and then back to 4x4. Libraries happen to give the right result. It's more robust
to set `V[0,3]=V[1,3]=V[2,3]=0`. This turns `V` into the desired view matrix, call it `detrans(V)`. I.e., we zero out
the translation component. Then the correct matrix to draw the skybox is `P * detrans(V)` where P is the same
perspective transform used for the scene.

So how to implement? The obvious way is to compute `P * detrans(V)` in host side set up of uniforms for the sky box
shader. This is what most impls do. I looked at an alternative: tweaking the normal PV matrix in the shader. This saves
the boilerplate of setting up a new uniform. It entails copying the existing PV uniform and changing 3 elements: setting
two to zero and a more elaborate tweak to the third. I finally decided this is too fragile and messy.
