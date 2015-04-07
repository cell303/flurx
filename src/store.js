import Rx from 'rx';

function id(x) {
  return x;
}

class Store extends Rx.BehaviorSubject {
  constructor(value = {}) {
    super(value);
  }

  register(action, callback) {
    return action.subscribe(params =>
        this.onNext((callback || id).call(this, this.getValue(), ...params))
    );
  }
}

export default Store;
