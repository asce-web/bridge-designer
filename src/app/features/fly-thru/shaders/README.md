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

The sky box is defined around the origin. If culling, its triangles must be visible from the inside.

The usually unstated trick is that we ignore the usual MVP transform while drawing the box and use a different one. This
has the eye at the origin, but with the same view direction and perspective frustum angle as the rest of the scene.
Hence the viewer sees the swatch of the box included in the frustum. The size of the box doesn't matter because we force
the z-coordinate after perspective division to 1 by copying w of the final vertex coord to z (depth).

Online discussions don't tell the story above. They just show as an afterthought that you can magically get the required
view by coercing the usual 4x4 look-at matrix to 3x3 and then back to 4x4. Libraries just just happen to do the right
thing: removing the translation component (along with any perspective-like tapering if there were any). Rather than rely
on library tricks, it's more robust to set `V[0,3]=V[1,3]=V[2,3]=0` to turn `V` into `detrans(V)`; i.e., zero out the
translation component. Call this new matrix `detrans(V)`, then the correct matrix to draw the skybox is `P * detrans(V)`
where P is the same perspective transform as used for the scene.

So how to implement `detrans`? The obvious way is to compute `P * detrans(V)` on the host side and move it to a
dedicated uniform. This is what most impls do. I looked at maybe tweaking the normal PV matrix in the shader instead.
This saves the boilerplate of setting up a new uniform. It entails copying the existing PV uniform and changing 3
elements: two get zero'ed out and the last is more complex. I finally decided the math magic was fragile.
