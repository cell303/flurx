import Rx from 'rx';

function id(x) {
  return x;
}

class Store extends Rx.BehaviorSubject {
  constructor(value = {}) {
    super(value);
  }

  register(action, callback, successCallback, failureCallback) {
    const subscription = action.subscribe(params =>
        this.onNext((callback || id).call(this, this.getValue(), ...params))
    );

    if (successCallback && failureCallback && action.Success && action.Failure) {
      return Rx.CompositeDisposable(
        subscription,
        action.Success.subscribe(params =>
            this.onNext(successCallback.call(this, this.getValue(), ...params))
        ),
        action.Failure.subscribe(params =>
            this.onNext(failureCallback.call(this, this.getValue(), ...params))
        )
      );
    } else {
      return subscription;
    }
  }
}

export default Store;
