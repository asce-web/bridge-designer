<!-- Copyright (c) 2025-2026 Gene Ressler
     SPDX-License-Identifier: GPL-3.0-or-later -->

# Iterations

An iteration from the user's point of view is a non-empty series of design changes followed by either a test or a jump
to some previous iteration. Iterations are numbered consecutively as they're created. The BD captures the number, the
bridge, and related information (see below) at the end of each iteration. The captured bridge is immutable.

The UI allows the user to jump among iterations. For each jump, the captured bridge and its iteration number are
restored. A fresh iteration begins at the next change to the bridge.

## The iteration in progress

The number of the _iteration in progress_, i.e. the design visible at the moment in the drafting panel, is always
displayed to the user. The in-progress iteration is either open or closed. It is closed if and only if the bridge has
just been tested with no further edits afterward. Otherwise it is open.

Performing some edit operation on a closed iteration automatically creates a new, open, in-progress iteration with the
next available number. The user sees the displayed in-progress iteration number advance. This is the only mechanism for
creating new iterations. Multiple tests of an unchanging design (e.g. to repeatedly view the truck animation) are all
part of the same iteration.

## Iteration objects

In the implementation, an iteration is an object including the bridge model, its test status (which might be "not
tested"), and for UI display only, its cost. The bridge model is an immutable deep copy for closed iterations. For an
open one, which is necessarily also in-progress, it's a shallow reference to the bridge in the drafting panel. A full
list of fields:

- Iteration number.
- Test status: Pass, fails load, fails slenderness, unstable, or "none" for iterations that resulted from jumping to a
  new iteration before the in-progress one was tested.
  - The status of the iteration in progress comes directly from analysis validity service.
- Bridge cost.
- Project ID.
- Child iterations. (See below.)

Since the Project ID can be modified at any time, the user can effectively use it to label captured iterations.

## Iteration jumping

At any time, the user can ask the BD for a dialog with a list of iterations including the one in progress. A preview
pane shows a sketch of the currently selected one. The user can choose to jump their design to the selected iteration.
This jump can be backward or forward in the iteration sequence. There are three possibilities:

- User chooses the in-progress iteration. Whether open or closed, this is a no-op. Logically, we could omit the current
  iteration from the list, but this might be confusing for users.
- User chooses an earlier iteration.

What happens in the second case?

- First, deal with the in-progress iteration. Two possibilities:
  - It was open, it is captured and closed. Its test status is "none".
  - It was closed, no further work is required. Its bridge model was already captured when tested.
- Next, the captured bridge of the chosen iteration is restored to the drafting panel.
- The displayed iteration number becomes the one taken from the restored bridge model.
- The undo manager's command buffer is cleared.
- The current BD test status becomes "none." I.e. whatever test was current becomes out-of-date.
- The newly loaded iteration is considered in-progress and - because it was tested when captured - closed.

An alternative way to treat newly loaded iterations that were closed with a jump before testing would be to continue
them as open. I.e. such captured iterations are mutable. This idea was discarded as too surprising for users.

## Parent-child relation of iterations

Every iteration has a natural child relationship with its predecessor. After a jump, the jumped-to iteration becomes the
prospective parent. Since an iteration can be jumped-to any number of times, parent-child pairs naturally form an n-ary
tree.

Consequently, the UI widget offers two views of iterations:

- List in iteration number order.
- Treegrid showing parent-child relationships. Each run of parent and successively numbered descendants is shown as a
  single list. Each time an iteration is jumped-to, it gets a new list, which again continues as long as descendants are
  successive numbered.
  - It's an unfortunate detail that the treegrid view hides some information. If the same iteration is jumped-to
    multiple times, each followed by a sequence of new iterations, these sequences are effectively concatenated into a
    single list in the treegrid view. TODO: It may be possible to give visual cues - via an extra column of icons or
    similar - where the sub-lists are separated. This would make the view capable of showing the full multi-tree
    structure.

For the user, it's expected that the list view is superior for going back a small number of iterations, while the
treegrid makes it easier to navigate among major decision points.

## Lifetimes

Iterations persist throughout a user's session until user requests a new bridge, sample bridge, or previously saved
bridge.

Iterations are part of session state, so live between uses of the same browser/machine combination.

## Implementation details

- Dialog component.
- Design iteration service. Container for iteration data.
- Displayed iteration number.
- Interaction with analysis validity service.
- Interaction with session state preservation.

## Data structures

- Array of design iteration records
  - Source data for UI widgets
  - Treegrid uses parent reference option.
- The in-progress iteration refers to the current bridge. So dialog preview reflects current state. A closed bridge gets
  a deep copy snapshot.
- Reference by index including parent pointer.
- State:
  - Iteration array.
  - In-progress iteration index.
  - "In-progress iteration is closed" flag.

## Event handling

- Load bridge. Three cases.
  - New bridge, sample bridge, or user's bridge.
    - Clear iterations.
    - Create open in-progress iteration numbered from the bridge model (already set to 1 for new bridges).
  - Load iteration bridge.
    - Do nothing. (Previously closed iteration is now in-progress.)
- User chooses iteration.
  - If current in-progress, do nothing.
  - Else
    - Close in-progress iteration by deep copy.
    - Change in-progress pointer to closed iteration chosen and load its bridge model.
- Analysis complete.
  - If current iteration is open, close it.
  - Update in-progress iteration status. This is relevant where "working" was set for newly loaded and previously
    abandoned iterations.
- Edit command completion.
  - If in-progress iteration is closed, create a fresh, open iteration with the next sequence number. Drafting panel
    bridge gets sequence number updated to this.
  - Else in-progress iteration is open. Do nothing.

  ## Notes:
  - Undo/redo on a closed iteration behave like any other command. A new in-progress iteration is created.
