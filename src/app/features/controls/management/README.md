# User-facing interface management

This directory holds logic that determines the overall user experience: allowed operations, sequences of mutually
dependent operations, state changes affecting multiple UI elements. Mostly this a place for event handling and UI state
tracking that doesn't have another obvious owner.

You might expect the startup flow to be handled here: browser capability check, welcome dialog, tip dialog, initial
drafting panel state-setting. It's not. Rather, that's considered to be owned by the app component.

## Type safety of UiStateService

Currently any RxJs subject that participates in UiStateService can only be typed as `Subject<EventInfo>`. The `data`
field embedded in `EventInfo` is type `any`, so it's up to the user to ensure senders and receivers agree on what's
there. This is super fragile.

An attempt to add stronger typing turned up a need for existential generic types. Typescript doesn't support these
natively, but can "simulate" them by representing objects with generic parameters as wrappers that accept a callback and
return the object. The callback signature then transmits the parameter type. Example for future reference:

```
// 1. Define the internal generic interface
interface Box<T> {
  value: T;
  format: (val: T) => string;
}

// 2. Define the "Existential" wrapper as a higher-order function
// This says: "I hold a Box<T> for SOME T, and I'll give it to your callback."
type SomeBox = <R>(callback: <T>(box: Box<T>) => R) => R;

// 3. Create a helper to "hide" the type (the producer)
const makeBox = <T>(box: Box<T>): SomeBox => (callback) => callback(box);

// 4. Create your heterogeneous array
const boxes: SomeBox[] = [
  makeBox({ value: 123, format: (n) => n.toFixed(2) }),
  makeBox({ value: "Hello", format: (s) => s.toUpperCase() })
];

// 5. Consume the array safely
boxes.forEach(someBox => {
  const result = someBox(box => box.format(box.value)); // Correctly inferred per item
  console.log(result);
});
```
