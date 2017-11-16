import React from 'react'
import { Router, Route, hashHistory, browserHistory, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import store from '../redux/store'
import App from 'containers/app'

const accountBook = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/accountBook'))
    }, 'accountBook')
}
const typeIn = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/typeIn'))
    }, 'typeIn')
}
const statistics = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/statistics'))
    }, 'statistics')
}
const route = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute getComponent={accountBook}/>
            <Route path="accountBook" getComponent={accountBook}/>
            <Route path="typeIn" getComponent={typeIn}/>
            <Route path="statistics" getComponent={statistics}/>
        </Route>
    </Router>
)
const routes = (
    <Provider store={store}>
        {route}
    </Provider>
)

export default routes