
import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

/**
 * create the redux store
 * @namespace redux.store
 * @category redux
 * @param {string} rootReducer see ./src/reducers/index.js
 * @param {object} initialState see the initialState object in the reducers/*.js scripts
 * @param {object} composeWithDevTools(applyMiddleware(...middleware)) apply thunk middlewear for redux 
 */
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;