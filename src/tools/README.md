# User tools

This directory is for tools allowing Bridge Designer users to operate on
bridge files from the command line. They're intended for teachers and
others needing to compile results for groups of students, contestants,
etc.

## Compatibility

These are Node JS programs developed with v24.x. They should run fine on 
any platform where Node does. However, they've been tested only with
Linux. 

The CLI accepts lists of paths, expecting the shell to expand globs. A 
typical use case would be
```
bdc analyze *.bdc
```
to analyze all bridge files in a directory. This will work only with 
`bash`-style glob expansion by the shell. Windows Command and Powershell
don't do such expansion. Check out options like WSL, Git Bash, Cygwin,
or Nushell.

## Summary of current support

- Single CLI utility.
- Supports `ContestParameters`-setting search string JSON.
- Subcommands:
  - `list`: Print bridge files' contents to stdout, decrypting if necessary.
  - `analyze`: Analyze bridge files' bridges and print status: passing or
    failing by mode with optional additions:
    - Conditions: Scenario key code and standard tag if applicable.
    - Cost: Total of all fixed site and bridge costs
    - Member details: By-member synopsis of forces, strengths, and status.
   
## Implementation notes

A non-Angular tool chain is required to support any Angular service running
in a Node CLI. All below was inferred by searching documentation as
far as possible, then turning to possibly untrustworthy user reports and
offered "solutions" to similar problems. It certainly may contain errors.
The solutions adoped work, but may not be the best possible.

### Dependency injection

The main problem was dependency injection. Modern Angular static injection
depends strongly on the Angular Typescript compiler's decoration processing, 
which isn't supported in Node.  We could have used `new` to build a service
hierarchy manually, but this would have been fragile. 

Package [`injection-js`](https://github.com/mgechev/injection-js) is an
extraction of the old Angular reflective injection sub-system updated to support 
`inject()` and other constructs added since reflective injection was dropped.
The author/maintainer is at Google. The package honors `Injectable()`
notations and mostly "just works" after an injector including the required
service graph is constructed. The normal Angular `useValue` provider feature
allows replacing dependencies not needed at runtime (e.g. session save/restore)
with minimal dummy objects, pruning the service graph.

### Effect CLI

We decided to use [Effect CLI](https://www.npmjs.com/package/@effect/cli) to
provide command line parsing and handling support. It's verty nice, but has
a significant learning curve to gain familiarity with the `Effect` API, a 
medium-thick abstration layer over promises with minimal examples and
ofetn-thin documentation.

### Clashes

Unfortunately, Typescript compilation options of the DI and CLI packages
clash: CJS vs MJS. The `tsx` and/or `ts-node` methods of on-the-fly
compile-and-go Typescript execution preferred by Effect do not (again afaics) 
work with the reflection "shim" needed by DI. Finally, all existing BD code
uses Typescript-style imports with no filename suffixes, while Node expects
`.js`.

The simplest way to work around all of this appeared to be a Node-compatible
bundler. Since `esbuild` is already native to Angular, we used it here.
The last sticking point was that neither  `esbuild` nor Node handle decorations 
(`@Injectable()`) natively. This is fixed up with an  `esbuild` plug-in that
runs source through the Typescript compiler. The package author laments that
this slows down `esbuild`, but our little CLI still compiles in less than a
second. It's a bit scary that even using `esbuild --minify`, the output is
about three megabytes.
