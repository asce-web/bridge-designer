<!-- Copyright (c) 2025-2026 Gene Ressler
     SPDX-License-Identifier: GPL-3.0-or-later -->

# Shared services

Here are notes on selected services used by more than one component or other service. They cover only those that embody
major design conventions and/or don't have an obvious function.

## Bridge sketch service:

This holds algorithms for generating descriptions of the grayed sketches that the UI calls "templates." We avoid that
word for naming BD objects because Angular uses it differently. Some templates are created by algorithms. Others are
stored explicitly.

## Event broker

This is an injectable container for read-only RxJs `Subject`s that serve as internal pubsub channels. Some might argue
they all ought not to be in a single place in the source, but this works beautifully. The initial idea was to have a
subject wrapper that would support global event logging here. That hasn't proven necessary.

## UI State service

Implements the feature where multiple jqxWidget controls have the same function, hence all should

- invoke the same handler
- have identical disable/enable behavior
- TODO: have common tool tip text

Java Swing provided all this for the previous version. `UiStateService` working with `EventBrokerService duplicate it,
but with a very different pattern. They also support "UI mode" disablement. The modes are e.g. initial (no visible
bridge), design, and animation. For each widget, we need to override normal enablement with disable. E.g. we want most
but not all widgets disabled while in "initial" mode. This was provided by a separate class in Java.

The implementation uses `EventBroker` `Subject`s as keys to group respective widgets.

## Member label positioning

A nagging problem with printed bridge drawing has been overlapping labels, which make the drawing unreadable. This is an
attempt to solve the problem using force-directed graph layout techniques. A spring system allows labels to slid along
members with forces attracting them at the member mid-point, but repelling them from each other. A Runge Kutta
integrators integrates the equations of motion until a steady state is reached. It's not perfect, but a big improvement
over deterministic heuristics.

## Gussets

Gussets are drawn to cover complexity at joints in 3d fly-thru graphics, 3d printable exports, and 2d printable
drawings. The algorithm finds a set of points - member boundary points and pair intersections - that the gusset must to
include, takes the 2-d convex hull of these points, and, for 3d purposes, extrudes this to a prism wide enough to
include the joint's members.

Gussets are computed only once for the fly-thru model even though this doesn't look great for joints with big
exaggerated displacements in the fly-thru view. Recomputing them at frame rates to fix this would be a performance risk.
