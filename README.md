```tsx
const myReactThing = scene.add.react(
  // World X/Y position
  128, 128,
  // React component to be mounted
  MyReactComponent,
  // Initial props (optional)
  {
    myName: 'Andy',
    onSomeReactEvent: () => {
      console.log('Event triggered from MyReactComponent!');
    }
  }
);

// Later,
myReactThing.setProps({
  myName: 'A-Dawg'
});
// It's also a GameObject so we can transform it like anything else:
myReactThing.x = 512;
myReactThing.rotation = Math.PI / 2;
myReactThing.alpha = 0.5;
```

