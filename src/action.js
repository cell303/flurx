import Rx from 'rx';

function ensureArray(a) {
  return a == null ? [] : Array.isArray(a) ? a : [a];
}

function create(withSuccessFailure = true) {
  const start = new Rx.Subject();
  const end = new Rx.Subject();

  function action(...params) {
    action.onNext(params);
  }

  for (let key in Rx.Subject.prototype) {
    action[key] = Rx.Subject.prototype[key];
  }

  Rx.Subject.call(action);

  const _onNext = action.onNext;

  action.onNext = (params) => {
    start.onNext(params);
    _onNext.call(action, params);
    end.onNext();
  };

  action.waitFor = (observables) => {
    observables = ensureArray(observables);
    return start
      .flatMap((value) => {
        return Rx.Observable.combineLatest(
          observables.map((observable) => {
            observable = observable.takeUntil(end).publish();
            observable.connect();
            return observable;
          }),
          () => value
        );
      });
  };

  if (withSuccessFailure) {
    action.Success = create(false);
    action.Failure = create(false);
  }

  return action;
}

export default {create};
