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

The sky box is defined around the origin with triangles visible from the inside. The view needs to have the eye is at
the origin with the frustum angle indentical to the rest of the scene. Hence the viewer sees the swatch of the box
included in the frustum. The size of the box doesn't matter because the z-coordinate (after perspective division) is
artificially forced to 1 so that the swatch is always visible.

To get the transform the normal `P * V` becomes `P * detrans(V)`. Where `detrans` removes the translation performed by
`V`, so we're left with a rotation only. I.e. the eye is at the origin as desired. (The model transform here is always
the identity.)

So how to implement `detrans`? The obvious way is to compute `P * detrans(V)` on the host side and move it to a
dedicated uniform. This is what most impls seem to do.

**In the end, using the approach below seems too fragile.**

Could we save all that boilerplate? What structure does the "detransed" PV matrix have?

```
    X  0  X  0       X  X  X tx
P = 0  X  X  0   V = X  X  X ty
    0  0  G  X       X  X  X tz
    0  0 -1  0       0  0  0  1
```

Here tx, ty, tz are the translation part of the view. Setting them zero affects only the last column of PV.

```
              X  X  X  0
detrans(PV) = X  X  X  0
              X  X  X  @ - G tz
              X  X  X  @ + tz
```

Here `@` is the normal PV value. So we could patch the last column of normal PV in the vertex shader. There are only 36
vertices being processed. Note we can even ignore the `@ - G tx` patch because the z-coord of the result is never used.
