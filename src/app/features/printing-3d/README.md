<!-- Copyright (c) 2025-2026 Gene Ressler
     SPDX-License-Identifier: GPL-3.0-or-later -->

# 3d Printing Support

## Requirement

On command, we emit OBJ files suitable for slicing and printing. It's OBJ rather than STL so that multiple parts can be
included as separate objects. STL supports only one.

There appears to be no reasonable way to make the prints functional. They’ll amount to near-scale display models.

The pieces are:

- **Two trusses**. A pair of mirror image meshes. Joints are are small diamond-shaped holes to receive same-shaped
  cross-member pins. The deck side of the truss is flat so that no printing supports are needed. Members have scale
  sizes. The extra thickness of gussets will all be on the outside surface.
- **Cross-members**. Thin square bars with pins that snap into joint holes in trusses.
- **Deck segments**. L-shaped prisms. All but one includes one deck beam and one segment of deck and wear surface. The
  end over each beam has a slot that matches a tab on the corresponding non-beam end of the next segment. End segments
  include the deck cantilever and abutment pillow block. The right end segment is special in that it includes the _two_
  rightmost beams and a slot. It is the first segment snapped in during assembly and furnishes the first slot. Slots are
  slightly elongated so that each segment's pin can be inserted without its tab interfering as the user adds segments
  right to left. Deck beams at piers also include pillow blocks. Pillow blocks include tabs that mate with slots in
  abutments.
- **Abutments and pier**. Prisms including the step for the joint and anchorage pillows (if any) with required mating
  slots to receive pillow block tabs. The pier (if any) is a separate, similar piece.

Note we're ignoring the anti-sway cross-members. Ideally there would be a small eye at each member end where the user
could use needle and thread to add them. But that face of the truss is on the platen. A less elegant possibility is to
put a hole at the respective correct place in each gusset. The user would hot glue a thread at one end, pull taut, and
hot glue the other end. Triangulation of gussets with these holes could get messy.

## Settings

- **Scale**. We need to allow setting the scale of the bridge, since printers have different platen sizes.
- **Minimum feature size**. The smallest possible members are 30mm square. If a 44m span is printed 8 inches long, such
  small members made to scale would be 0.138mm square. Consumer grade 3d printers have a minimum closer to 0.4mm. We'll
  let the user choose a not-to-scale minimum size in the range 0 to 1mm.

## Making the truss a manifold.

Slicers only sporadically support objects that aren't proper manifolds. All the pieces listed above are simple to emit
as manifolds except the trusses. Truss triangle sets generated for fly-thru rendering are one (partial) manifold per
member, one per gusset, and another per joint pin. The hidden surface removal of OpenGL resolves boundaries between
these. We're therefore in need of an algorithm to render a bridge truss as a manifold.

### Trusses are special

This is a polytope union problem, albeit restricted:

- The members are all axis-oriented rectangular prisms.
- The maximum of 120 members limits arrangement size to about 720.
- The gussets are all convex polygons, each with a single hole, extruded on the z-axis.
- The perimeter facets of gussets are normal to member axes.
- The interior surface of the truss is flat.
- Since the bridge is constructed on a grid, arbitrary degeneracies - nearly parallel lines, nearly coincident points,
  etc. - are unlikely to cause floating point precision issues.
  - Special attention will be needed to the gusset points at member intersections. One option is to merely shift these
    slightly so they don't coincide with the intersections themselves.

Possible ways to proceed:

- Use an existing library.
- Reason about finding the union of 2D polygons rather than general polytopes, then enhance the 2d algorithm with
  consideration of the z-axis.
- Try to exploit the restricted geometry of gussets.

### Analysis summary

Exploiting gusset geometry to trim each incident member and add a corresponding hole in the gusset edge is fairly
simple. Unfortunately, there's no similar simple way to handle intersecting members. These can get arbitrarily messy. We
could disallow such crossing members to solve the problem, but this is a restriction of the original BD intent, and it's
probably not a realistic constraint. So this option is out.

I looked at various approaches to building my own algorithm for computing the union of manifolds: plane sweep and edge
tracing. Despite trusses being simpler than the general problem, the algorithms are big projects. Moreover, the
literature is full of warnings about floating point precision-related fragility. Since I spent a year of my life
experiencing this during my MS work in the 80's, and there are PhD dissertations working on the problem well into the
2000's, I will not re-invent this wheel.

The best option appears to be the [manifold library](https://github.com/elalish/manifold). It's written in C++, but has
an emscripten compilation to WebAssembly. It's based on a PhD dissertation claiming to be a practical, FP-robust
algorithm. It's frequently maintained and has many users. It's Apache licensed, so no fee issues. The main down side is,
indeed, also a strength. That's WebAssembly. While mainstream since 2007, some of its features have been supported in
Chromium browsers only since 2022.

# Packing objects onto the printer stage

This is a big project on the top level TODO list, currently "won't fix" pending user feedback.
