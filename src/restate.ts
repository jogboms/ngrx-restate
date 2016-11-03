/**
 * Persist ngRx States on page reloads
 *
 * e.g.
 * const config = {
 *   states: ['reducer_name', ..., 'more_reducer_names'],
 *   storage: localStorage, // Default
 *   delay: 5000
 * }
 * compose(restate(config), combineReducers)({'reducer_name': (state, action) => {}, ..., 'more_reducer_names': (state, action) => {}})
 */
interface RestateConfig {
  /**
   * States to Re-state on page reload. The names should tally with the Original state's name in the store.
   * If left unassigned, All states is Re-state'd back to the Store. Optional.
   * @type {Array<string>}
   */
  states?: string[];
  /**
   * Storage type to use in Persisting state. Should be of key-value type.
   * Defaults to localStorage. Optional.
   * @type {Object}
   */
  storage?: Object;
  /**
   * Debounce delay when persisting states to storage. Delay in milliseconds.
   * Defaults to 3500. Optional.
   * @type {number}
   */
  delay?: number;
}
const defaults: RestateConfig = {
  states: undefined,
  storage: localStorage,
  delay: 3500
}
/**
 * Higher-order function that returns the Meta-Reducer
 * @param {RestateConfig = defaults} config Configuration for Meta-Reducer
 * @returns {Function}
 */
export default function restate(config: RestateConfig = {}) {
  config = Object.assign({}, defaults, config);
  return (reducer) => {
    const state = {}, key = '__RESTATE__', style = ['color:green;font-weight:700', 'font-weight:normal'],
    save = (state = {}) => {
      if(config.storage)
        config.storage[key] = JSON.stringify(state);
    },
    load = () => {
      if(config.storage && config.storage[key]) {
        const data = JSON.parse(config.storage[key]);
        if(config.states)
          config.states.map(n => state[n] = data[n])
        console.log('%c@ngRx Re-State: %cLoaded state from Storage', ...style);
        return config.states ? state : data;
      }
      return undefined;
    },
    persit = (state) => {
      console.log('%c@ngRx Re-State: %cSaving state to Storage', ...style);
      save(state);
    },
    throttle = (call, time) => {
      var id = null, max = 0;
      return (...args) => {
        if(id !== null && max <= Math.ceil(time/1000)) {
          clearTimeout(id);
        }
        if(max > Math.ceil(time/1000)) max = 0;
        id = setTimeout(() => call(...args), time);
        ++max;
      };
    },
    restate = throttle(persit, config.delay);

    return (state = load() || undefined, action) => {
      const new_state = reducer(state, action);
      restate(new_state);
      return new_state;
    };
  }
}
