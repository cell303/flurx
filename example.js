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

    /*
     this.register(LoginAction, this.onLogin);
     this.register(LoginAction.Success, this.onLoginSuccess);
     this.register(LoginAction.Failure, this.onLoginFailure);
     */

    // Shorthand:
    this.register(LoginAction, this.onLogin, this.onLoginSuccess, this.onLoginFailure);
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
    });
  }

  onLoginFailure(store, err) {
    return Object.assign(store, {
      isLoggedIn: false,
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
