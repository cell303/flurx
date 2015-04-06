jest.dontMock('../action.js');
jest.dontMock('../store.js');

describe('the universe', () => {
  it('should exist', () => {
    expect(true).toBe(true);
  });
});

describe('Action', () => {
  const Action = require('../action.js');

  it('should exist', () => {
    expect(Action).toBeDefined();
  });

  it('should create an action', () => {
    const TestAction = Action.create();
    expect(TestAction).toBeDefined();
  });

  it('should create Success and Failure actions', () => {
    const TestAction = Action.create();
    expect(TestAction.Success).toBeDefined();
    expect(TestAction.Failure).toBeDefined();
  });

  it("should notify listeners when called", () => {
    const TestAction = Action.create();
    TestAction.subscribe(params => {
      expect(params[0]).toEqual('Test');
      expect(params[1]).toEqual(1);
      expect(params[2]).toBeUndefined();
    });
    TestAction('Test', 1);
  });

  it("should wait for stores", () => {
    const Store = require('../store.js');

    const TestAction = Action.create();

    let calledA = false;
    let calledB = false;

    const storeA = new Store();
    const storeB = new Store();

    storeA.register(TestAction, (value, name, nr) => {
      expect(name).toEqual('Test');
      expect(nr).toEqual(2);
      calledA = true;
      return value;
    });

    storeB.register(TestAction, (value, name, nr) => {
      expect(name).toEqual('Test');
      expect(nr).toEqual(2);
      calledB = true;
      return value;
    });

    TestAction.waitFor([storeA, storeB]).subscribe(() => {
      expect(calledA && calledB).toBe(true);
    });

    TestAction('Test', 2);
  });
});
