# Rendering

This directory contains rendering logic for fly-thru animation models.

## Organization

- **Rendering services.** These accept model mesh data and turn them into "meshes", which contain everything needed to
  render once per frame, including OpenGL objects. There is a hierarchical level graph of kinds of meshes:

  - **Top-level.** This is `RenderingService.` It injects a renderer for each kind of scene object and exports functions
    to initialize them and render at the frame rate. It does initializations: one-time (e.g. for the sky box),
    once-per-design-conditions (e.g. terrain), and once per bridge.
  - **Specific.** These are dedicated to a specific scene object type. They are called directly from the top level.
    Examples: abutments, the bridge, UI overlays, river, sky box, truck, utility lines.
  - **General purpose.** These render generic meshes. They may be called by top-level or specific renderers. Examples:
    Included are meshes with simple colors per-facet, meshes painted entirely with a single texture, and collections of
    line segments called "wires."
  - Note that `MeshRenderingService` is a wrapper for nearly all rendering at the lowest level, i.e. OpenGL interaction.
    OpenGL is a state machine. It seems good for all interaction with it to be centralized. The consequence is that this
    service contains both specific and general purpose rendering, e.g river and colored meshes. More complicated
    specific renderers have their own services, which do their work by injecting this class.

    An exception is `OverlayRendering` (with related `OverlayUI`). It stands alone because it's essentially different:
    2D and "hot" for pointer operations.

  - We elected to use only two types to represent all kinds of meshes and underlying mesh data: one for triangles and
    the other for lines. It's up to the caller to call the renderXXX() function only for a mesh prepared as type XXX.
    This isn't checked.
  - Meshes consume OpenGL resources. When they're re-prepared() for rendering, it's important to delete the old one
    using `MeshRenderingService`.

- **View service.** Maintains the view transformation of the eye flying through the rendered view.
- **Viewport.** Maintains the projection transformation. This depends on the window (vieport) size, so it listens for
  changes.
- **Uniform service.** Consolidates all OpenGL uniform handling (i.e. shader global data), which is shared by all
  rendering.
- **Animation.** Triggers frame rendering and manages the animation clock, e.g. pause and resume that cause the
  animation to freeze and restart at user request.
- **Interpolators.** Provides interpolated analyses that lie between the discrete load cases, also second level
  interpolations ("bi-interpolations") between pairs of these. See details below.
- **Simluation state.** Uses the animation clock and interpolators to determine what's going on in the load test
  simulation: applying the dead load, truck materializing as it approaches the bridge, traversing the bridge,
  dematerializing on the other side, or perhaps failing.

## Interpolation

The interpolation service provides the underlying data for the load test animation. These include:

- Joint displacements.
- Member forces. Used to determine color cues.
- The 2d (x, y) contact point of the truck's front tires.
- The z-axis rotation vector for the truck that places all tires on the bridge.
  - Also used as the view vector of a person in the truck cab.

While the idea is simple, implementation has nuances.

### The progress parameter

A single parameter (`t` in the code) gives the position of the truck load's front tire contact point. It is
_approximately_ the x-coordinate of the truck's front tire contact with the pavement. The details are more complicated
because joint displacements can be arbitrarily large in degenerate cases. Exaggeration makes them worse. E.g. if an arch
sways far to the right under dead load, what should the truck do when it reaches the edge of the left abutment?
"Teleport" to the first panel? "Fly" over the gap? What if the bridge sways to the left instead? Should the truck
teleport backward or ignore one of the two overlapping chunks of roadway? If ignore, which?

We chose a "no teleport" policy. The truck should follow the roadway smoothly. Where the abutment gap is large, it
should "fly" across it. To achieve this:

- Follow the roadway centerline with `t` = x until `t` = L, the x-coordinate of the leftmost deck joint with only dead
  load applied.
- The parameter space from L to R is now used to interpolate among the deck joints. If there are N of these, then
  `(t -  L) / (R - L)` is the fraction of the deck the truck has traversed.
- Upon reaching R, again follow the roadway centerline with x=t.

This can result in instantaneous jumps in the y-direction if deck end and terrain height differ. We won't worry about
that, since major elevation differences wouldn't be practical designs.

One important effect of this definition of parameter is that a valid analysis is needed to set one. This requires
interpolators to be created "lazily" when an analysis is guaranteed present.

### Interpolators and their data sources

Interpolation is implemented with two interfiaces. A data source interface provides raw data e.g. displaced joint
locations and member forces. Implementations broadly follow an adapter pattern:

- An analysis adapter exposes a bridge analysis in the expected form.
- A "bi-source" interpolates between two other data sources and via its own parameter.
- A "zero force" source always returns zero displacements and

An interpolator accepts a data source and produces interpolated data similar to what the source provides, but includes
other derivative attributes e.g. about failure of the structure at the current interpolation point.

There are two kinds of interpolator: one that interpolates a single source and another that's specialized for the bridge
collapse animation.

Withall, there are three interpolators managed by the simulation state machine. Only one is effective at any time.

- The _dead loading phase_ interpolator is a normal source interpolator with a bi-source interpolating between the zero
  load case and the analysis dead load only case.
- The _traversal interpolator_ has the analysis as a data source, so the output is interpolating analysis load cases
  directly.
- The _collapse interpolator_ is an odd duck. It uses a bi-source of two adapters, each connected to its own analysis.
  One is the normal bridge analysis with its parameter frozen at the first value where a member fails. The second is
  computed on the fly. Each failed member from the first analysis is artificially weakened by a large factor, and then
  the analysis is completed. The weakened members cause very large joint displacements that roughly approximate bridge
  failure. Its parameter is frozen at the same value, so the truck is positioned on the distorted bridge. The bi-source
  parameter is varied to go smoothly from the intially failed state to the large displacements of the distorted
  analysis.

  The odd bit is that a normal source analysis interpolator of the bi-source would produce some incorrect results in
  addition to the joint displacements and truck locations needed for the animation. These are the member forces and
  derived failure data. The member forces in the artifically weakened bridge have no useful meaning. We don't want them
  to affect the collapse interpolator's outputs at all. Consequently, there is a custom collapse intepolator
  implementation that is just a wrapper for two others: the bi-source interpolator and also a normal analysis
  iterpolator to the normal analysis. The wrapper delegates to the correct wrapped interpolator for each kind of output.
