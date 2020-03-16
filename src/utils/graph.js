/**
 * @fileOverview Defines classes used in computational graphs. Used for efficient filtering without unnecessary computation
 * @author Jonah Joughin
 */

// Class defining input notes. When set, triggers evaluation in all nodes which are direct or indirect dependents
export class InputNode {
  constructor(_set) {
    this._set = _set;
    this._dependents = [];
  }

  set = (...args) => {
    let _newValue = this._set(...args, this._value);
    if (this._value != _newValue) {
      this._value = _newValue;
      for (let dependent of this._dependents) {
        dependent.invalidate();
      }
    }
  };

  get = () => {
    return this._value || undefined;
  };
}

// Class defining function nodes. Lazily evaluate, and don't recompute unless invalidated.
export class FunctionNode {
  constructor(_get, _dependencies) {
    this._get = _get;
    this._dependencies = _dependencies;
    this._dependents = [];
    for (let node of _dependencies) {
      node._dependents.push(this);
    }
  }

  invalidate = () => {
    this._value = undefined;
    for (let node of this._dependents) {
      node.invalidate();
    }
  };

  get = () => {
    if (this._value != undefined) {
      return this._value;
    } else {
      const dependencies = this._dependencies.map(x => x.get());
      if (dependencies.includes(undefined)) {
        return undefined;
      } else {
        this._value = this._get(dependencies);
        return this._value;
      }
    }
  };
}

/**
 * Creates input node which updates in response to Redux Actions.
 *
 * @param {(action, state) => value}   setFn   Function determining value of node
 * @param {(action, state) => boolean}   filterFn   Function determining whether node should be updated in response to action
 *
 * @return {InputNode} New Input Node
 */
export const actionInputNode = (setFn, filterFn) =>
  new InputNode((action, state, value) => {
    if (filterFn(action, state) || !value) {
      return setFn(action, state);
    } else {
      return value;
    }
  });
// Functional wrapper around function node class
export const functionNode = (_get, _dependencies) =>
  new FunctionNode(_get, _dependencies);
