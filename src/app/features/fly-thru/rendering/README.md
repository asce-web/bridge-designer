# Rendering

If you're reading this, the organization may not be obvious.

## Organization

- **Rendering services.** These accept model mesh data and turn them into "meshes", which contain everything needed to
  render once per frame, including OpenGL objects. There is a hierarchical level graph of kinds of meshes:

  - **Top-level.** This is `RenderingService.` It injects a renderer for each kind of scene object and exports functions
    to initialize them and render at the frame rate. It does one-time initializations (e.g. for the sky box),
    once-per-design-conditions (e.g. terrain), and once per bridge configuration.
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

### The progress parameter

A single parameter (`t` in the code) gives the position of the truck load's front tire contact point. It is
_approximately_ the x-coordinate of the truck's front tire contact with the pavement. The details are more complicated
because joint displacements can be arbitrarily large in degenerate cases. Exaggeration makes them worse. E.g. if an arch
sways far to the right under dead load, what should the truck do when it reaches the edge of the left abutment?
"Teleport" to the first panel? "Fly" over the gap? What if the bridge sways to the left instead? Should the truck
teleport backward or ignore one of the two overlapping chunks of roadway? If ignore, which?

We chose a "no teleport" policy. The truck should follow the roadway smoothly. Where the abutment gap is large, it
should fly "fly." To achieve this:

- Follow the roadway centerline with x=t until `t` = L, the x-coordinate of the leftmost deck joint with only dead load
  applied.
- The parameter space from L to R is now used to interpolate among the deck joints. If there are N of these, then
  `(t -  L) / (R - L)` is the fraction of the deck the truck has traversed.
- Upon reaching R, again follow the roadway centerline with x=t.

This can result in instantaneous jumps in the y-direction if deck end and terrain height differ. We won't worry about
that, since major elevation differences wouldn't be practical designs.

### Types of interpolations

There are multiple

- **Load case.** This interpolates between successive load cases, i.e. positions of the truck. The analysis service
  computes a discrete data set for each point where the front tire of the truck coincides exactly with a deck joint.
  Because the truck wheel base length matches deck panel size, the rear tire is also on a joint if over the bridge.
  Happily, it's valid to linearly interpolate all the needed quantities from those of adjacent joints.

  - The input is a single analysis i.e. analysis service instance.
  - The interpolation parameter is the truck's x-coordinate. Any load case interpolation with t <= 0 or t >= (span
    length + truck length) is called "dead load only." The truck load isn't affecting the bridge.

- **Special.** These are load case-like interpolations with specific purposes:

  - **Null loading.** This is a load case interpolation for the negative parameter value called the "start setback"
    where the truck starts its move toward the bridge. It is essentially static data. The bridge has zero load applied,
    including dead loads. There are no inputs, and the parameter is fixed at the start setback.

  - **Failure loading.** This is a normal load case interpolation except that the underlying analysis instance roughly
    simulates failed members by applying a factor of 1/50 to their strength.

- **Bi-interpolations.** This interpolates between two of the previous load case interpolations having the same
  parameter value, i.e. the truck is not moving.

  - The input is load case interpolations A and B.
  - The linear interpolation parameter, where t=0 corresponds to A and t=1 to B.

  They're used for two parts of the animation:

  - **Dead loading phase.** This depicts the truck at the start setback. It animates the interpolation between the null
    loading and dead loading-only conditions over a few seconds.
  - **Failure phase.** This animates a rough approximation of the bridge failing by interpolating between the normal
    load case interpolation at the point of failure and a corresonding special failure loading interpolation.

  In the implementation it proved simplest to interpolate the source data (joint displacements and member forces), and
  provide this to the normal load case interpolator algorithm.
