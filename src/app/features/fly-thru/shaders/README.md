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
