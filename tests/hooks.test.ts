import { Hookable } from '../src/Hooks';

@Hookable
class Mock {
  public sayHello() {}
}

let mock;

beforeEach(() => {
  mock = new Mock();
});

test('can access hooks', () => {
  expect(mock.hooks).toBeDefined();
});

test('can access hooks.create', () => {
  expect(mock.hooks.create).toBeInstanceOf(Function);
});

test('can install a hook that exists', () => {
  const callback = jest.fn();

  mock.hooks.create('sayHello', callback);

  expect(mock.hooks.hooks.length).toBe(1);
  expect(mock.hooks.hooks[0]).toMatchSnapshot();
  expect(mock.hooks.hooks[0].callback).toBe(callback);
});

test('can install multiple hooks', () => {
  mock.hooks.create('sayHello', jest.fn());
  mock.hooks.create('sayHello', jest.fn());
  mock.hooks.create('sayHello', jest.fn());
  expect(mock.hooks.hooks.length).toBe(3);
});

test('installing a hook overwrites the original function', () => {
  const orig = mock.sayHello;
  mock.hooks.create('sayHello', jest.fn());
  expect(mock.sayHello).not.toBe(orig);
});

test('fails when installing a hook that does not exist', () => {
  expect(() => {
    mock.hooks.create('screamHello', jest.fn());
  }).toThrowError();
});

test('invokes a hook if the original function is invoked', () => {
  const callback = jest.fn();
  mock.hooks.create('sayHello', callback);
  mock.sayHello();
  expect(callback).toHaveBeenCalled();
});

test('an invoked hook has a next function', () => {
  const callback = jest.fn();
  mock.hooks.create('sayHello', callback);
  mock.sayHello();
  expect(callback).toHaveBeenCalledWith(expect.any(Function));
});

test('an invoked hook includes additional parameters after the next parameter', () => {
  const callback = jest.fn();
  mock.hooks.create('sayHello', callback);
  mock.sayHello(1, 'hello', true);
  expect(callback).toHaveBeenCalledWith(expect.any(Function), 1, 'hello', true);
});

test('calls the orig function after a hook calls next', () => {
  const spy = jest.spyOn(mock, 'sayHello');
  mock.hooks.create('sayHello', next => next());
  mock.sayHello();
  expect(spy).toHaveBeenCalled();
});

test('does not call the orig function after a hook does not call next', () => {
  const spy = jest.spyOn(mock, 'sayHello');
  mock.hooks.create('sayHello', next => {});
  mock.sayHello();
  expect(spy).not.toHaveBeenCalled();
});

test('calls the orig function after multiple hooks call next', () => {
  const spy = jest.spyOn(mock, 'sayHello');
  mock.hooks.create('sayHello', next => next());
  mock.hooks.create('sayHello', next => next());
  mock.hooks.create('sayHello', next => next());
  mock.sayHello();
  expect(spy).toHaveBeenCalled();
});

test('does not call the orig function after one hook does not call next', () => {
  const spy = jest.spyOn(mock, 'sayHello');
  mock.hooks.create('sayHello', next => next());
  mock.hooks.create('sayHello', next => {});
  mock.hooks.create('sayHello', next => next());
  mock.sayHello();
  expect(spy).not.toHaveBeenCalled();
});
