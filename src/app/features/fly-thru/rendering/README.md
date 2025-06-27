# Rendering

If you're reading the code here, the organization may not be obvious.

- **Rendering services.** These accept model mesh data and turn them into "meshes", which contain everything needed to
  render once per frame, including OpenGL objects. There is a hierarchical level graph of kinds of meshes:

  - **Top-level.** This is `RenderingService.` It injects a renderer for each kind of scene object and exports funtions
    to initialize them and render at the frame rate.
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
- **Uniform service.** Consolidates all OpenGL uniform handling, which is shared by all rendering
- **Animation.** Triggers frame rendering and manages the animation clock, e.g. pause and restart that cause the
  animation to freeze and restart at user request.
