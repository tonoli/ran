import { createStore } from 'redux';
import getReducer from './reducer';
import createMiddleware from './middleware';
import persist from './persist';
import { AUTH_SIGNIN, AUTH_SIGNOUT } from './auth/authActions';

let reduxStore = null;

export default (apolloClient, initialState) => {
  let store;
  if (!process.browser || !reduxStore) {
    const middleware = createMiddleware(apolloClient.middleware());
    store = createStore(getReducer(apolloClient), initialState, middleware);
    (async () => {
      const token = await Promise.resolve(persist.willGetAccessToken());
      if (token) {
        store.dispatch({ type: AUTH_SIGNIN });
      } else if (!token) {
        store.dispatch({ type: AUTH_SIGNOUT });
      }
    })();
    if (!process.browser) {
      return store;
    }
    reduxStore = store;
  }
  return reduxStore;
};
