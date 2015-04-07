jest.dontMock('../action.js');
jest.dontMock('../store.js');

describe('the universe', () => {
  it('should exist', () => {
    expect(true).not.toBe(false);
  });
});

describe('Store', () => {
  const Store = require('../store.js');
  const Action = require('../action.js');

  it("should notify listeners when any subscribed action happens", () => {
    const TestStore = new Store();
    const TestActionA = Action.create();
    const TestActionB = Action.create();

    let calledA = false;
    let calledB = false;

    TestStore.register(TestActionA, store => store);
    TestStore.register(TestActionB, store => store);

    TestStore.subscribe(() => {
      calledB = true;
    });

    TestStore.subscribe(() => {
      calledA = true;
    });

    TestActionA("TestA");
    TestActionB("TestB");

    expect(calledA && calledB).toBe(true);
  });

  it("should pass the Action call params", () => {
    const TestStore = new Store();
    const TestAction = Action.create();

    let called = false;
    TestStore.register(TestAction, (store, arg1, arg2) => {
      expect(arg1).toEqual('Test');
      expect(arg2).toEqual(1);
      called = true;
      return store;
    });

    TestAction('Test', 1);

    expect(called).toBe(true);
  });

  it("should start with the first store value", () => {
    const TestStore = new Store({a: 1, b: 2});

    TestStore.subscribe(store => {
      expect(store).toEqual({a: 1, b: 2});
    });
  });

  it('should produce new store values', () => {
    const TestStore = new Store({a: 1});
    const TestAction = Action.create();

    let i = 0;
    TestStore.subscribe(store => {
      switch (i++) {
        case 0:
          expect(store).toEqual({a: 1});
          break;
        case 1:
          expect(store).toEqual({a: 2});
          break;
        case 2:
          expect(store).toEqual({a: 3});
          break;
      }
    });

    TestStore.register(TestAction, store => {
      store.a = store.a + 1;
      return store;
    });

    TestAction();
    TestAction();

    expect(i).toBe(3)
  });
});

