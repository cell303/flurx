# Flurx

Following the tradition of ridiculously titled Flux variations, I'm proud to announce Flurx.

> Flux using RxJS, advocating but not strictly enforcing immutable data structures.

## Description

It's a very thin wrapper around `Rx.Subject` for Actions and `Rx.BehaviorSubject` for Stores, 
basically adding only two methods:

* waitFor on Actions
* register on Stores

In a nutshell:

* A Store is modelling a value that is changing over time (i.e. BehaviorSubject)
* A Store can subscribe to many Actions, each with a handler
* A handler receives the call parameters of the action and produces a new value of the store. 
* React components can subscribe to Stores
* React components can call Actions

## Installation
```
npm install flurx
```

## Example
```javascript
import React from 'react';
import {Store, Action} from 'flurx';

const LoginAction = Action.create();

class LoginStore extends Store {
  constructor() {
    super({
      isLoggedIn: false,
      username: null,
      warn: null
    });

    this.register(LoginAction, this.onLogin, this.onLoginSuccess, this.onLoginFailure);
    
    // Shorthand for:
    // this.register(LoginAction, this.onLogin);
    // this.register(LoginAction.Success, this.onLoginSuccess);
    // this.register(LoginAction.Failure, this.onLoginFailure);
  }

  onLogin(store, username, password) {
    if (!store.isLoggedIn) {
      getJSON('/login', {username, password})
        .then(LoginAction.Success)
        .catch(LoginAction.Failure);

      return Object.assign(store, {
        isLoggedIn: true,
        username,
        warn: null
      });
    }

    return store;
  }

  onLoginSuccess(store, result) {
    return Object.assign(store, {
      isLoggedIn: true,
      username: result.username
      warn: null
    });
  }

  onLoginFailure(store, err) {
    return Object.assign(store, {
      isLoggedIn: false,
      username: null,
      warn: err.message
    })
  }
}

const loginStore = new LoginStore();

const LoginComponent = React.createClass({
  getInitialState() {
    return loginStore.getValue();
  },

  componentDidMount() {
    this._subscription =
      loginStore.subscribe(store => {
        this.setState(store);
      });
  },

  componentWillUnmount() {
    this._subscription.dispose();
  },

  onSubmit(e) {
    e.preventDefault();

    let username = this.refs.username.getValue().trim();
    let password = this.refs.password.getValue().trim();

    if (!username || !password) {
      return;
    }

    LoginAction(username, password);
  },

  render() {
    return (
      !this.state.isLoggedIn ?
        <form method="GET" action="/login" onSubmit={this.onSubmit}>
          {this.state.warn != null ? <p>{this.state.warn}</p> : null}
          <input ref="username" name="username" type="text"/>
          <input ref="password" name="password" type="password"/>
          <button type="submit">Login</button>
        </form> :
        <p>Welcome, {this.state.username}.</p>
    );
  }
});
```