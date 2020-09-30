import React from 'react';
import ReactDOM from 'react-dom';
import './components/css/index.css';
import App from './components/_App';
//import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './_reducers';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';


const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

ReactDOM.render(
  <Provider
    store={createStoreWithMiddleware(
        rootReducer,
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >

    <BrowserRouter>
        <App />
    </BrowserRouter>

  </Provider>
  , document.getElementById('root')
);

//serviceWorker.unregister();
