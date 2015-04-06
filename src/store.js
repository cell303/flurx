import Rx from 'rx';

class Store extends Rx.BehaviorSubject {
  constructor(value = {}) {
    super(value);
  }

  register(action, callback = x => x, successCallback = x => x, failureCallback = x => x) {
    const subscription = action.subscribe(params =>
        this.onNext(callback.call(this, this.getValue(), ...params))
    );

    if (action.Success && action.Failure) {
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
