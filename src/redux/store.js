import { createStore, applyMiddleware, compose } from 'redux';
import {persistStore} from 'redux-persist';
import logger from 'redux-logger'; 

import rootReducer from './root-reducer';

const middlewares = [logger];
const composeEhancers=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer,composeEhancers(applyMiddleware(...middlewares)));

export const  persistor=persistStore(store);


