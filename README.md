# ngrx-restate
NgRx-restate is a @ngrx/redux meta-reducer/middleware for persisting Store States on page reloads.  
It currently supports only `localStorage` for now. 


Optional configuration.
```
const config = {
   states: ['state_name', ..., 'more_state_names'],
   storage: localStorage, // Default
   delay: 5000
 }
```
* `states` refers to an Array of state names within the store to persist. Defaults to all states.
* `storage` refers to storage means with which to persit this data. Defaults to `localStorage`.
* `delay` refer to the maximum throttle time (milliseconds) to persist states to storage. Defaults to 3500ms.

Root reducer composition.
```
const RootReducer = compose(restate(config), combineReducers)({
  'state_name': (state, action) => {}, 
  ..., 
  'more_state_names': (state, action) => {}
});
```

Provide in Root App Module as,
```
StoreModule.provideStore(RootReducer);
```

