import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger'
import thunkMiddleware from 'redux-thunk';
import reduce from '../reducer'

const store = createStore(reduce, applyMiddleware(logger, thunkMiddleware))

export default store