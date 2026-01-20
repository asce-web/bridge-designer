<!-- Copyright (c) 2025-2026 Gene Ressler
     SPDX-License-Identifier: GPL-3.0-or-later -->

# Bridge Designer, Cloud Edition

This repository contains the Bridge Designer, Cloud Edition sources. It is a single-page Angular client-side
application. There is currently no back end.

The source is released under the [GNU Public License, v3](https://www.gnu.org/licenses). See [COPYING](COPYING).

For more information about the app, see the [beta test home](https://gene-ressler.github.io/bridge-designer/).

## Additional README docs

Many of these are actually design notes that preceded implementation. They've been updated _post hoc_.

- [Source top level](https://github.com/gene-ressler/bridge-designer/tree/main/src#readme)
  - General features and shared functions
    - [User workflow management](https://github.com/gene-ressler/bridge-designer/tree/main/src/app/features/controls/management#readme)
    - [Browser capability introspection](https://github.com/gene-ressler/bridge-designer/tree/main/src/app/features/browser#readme)
    - [Session state](https://github.com/gene-ressler/bridge-designer/tree/main/src/app/features/session-state#readme)
    - [Edit commands for undo/redo](https://github.com/gene-ressler/bridge-designer/tree/main/src/app/features/controls/edit-command#readme)
    - [Shared services](https://github.com/gene-ressler/bridge-designer/tree/main/src/app/shared/services#readme)
  - User features
    - [Iterations](https://github.com/gene-ressler/bridge-designer/tree/main/src/app/features/iterations#readme)
    - [Fly-thru test animation](https://github.com/gene-ressler/bridge-designer/tree/main/src/app/features/fly-thru#readme)
      - [Rendering](https://github.com/gene-ressler/bridge-designer/tree/main/src/app/features/fly-thru/rendering#readme)
      - [Shaders](https://github.com/gene-ressler/bridge-designer/tree/main/src/app/features/fly-thru/shaders#readme)
      - [View pane](https://github.com/gene-ressler/bridge-designer/tree/main/src/app/features/fly-thru/pane#readme)
    - [3d printing](https://github.com/gene-ressler/bridge-designer/tree/main/src/app/features/printing-3d#readme)
