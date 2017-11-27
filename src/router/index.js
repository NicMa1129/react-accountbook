import React from 'react'
import { Router, Route, hashHistory, browserHistory, IndexRoute, applyRouterMiddleware } from 'react-router'
import {
    useHistoryRestoreScroll,
    useRouterRestoreScroll
} from 'react-router-restore-scroll'
import { Provider } from 'react-redux'
import store from '../redux/store'
import App from 'containers/app'

const createHistory = useHistoryRestoreScroll(() => browserHistory)

const routerRender = applyRouterMiddleware(
    useRouterRestoreScroll()
)

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
const detail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/detail'))
    }, 'detail')
}
const searchAccount = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/searchAccount'))
    }, 'searchAccount')
}
const enterTypeIn = (nextState, replace, callback) => {
    let { location } = nextState
    // if(location.action !== 'PUSH'){
    //     replace('/accountBook')
    // }
    callback()
}
const route = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute getComponent={accountBook}/>
            <Route path="accountBook" getComponent={accountBook}/>
            <Route path="typeIn(/:blockId/:itemId)" getComponent={typeIn} onEnter={enterTypeIn}/>
            <Route path="statistics" getComponent={statistics} onEnter={enterTypeIn}/>
            <Route path="detail/:id" getComponent={detail} onEnter={enterTypeIn}/>
            <Route path="searchAccount" getComponent={searchAccount} onEnter={enterTypeIn}/>
        </Route>
    </Router>
)
const routes = (
    <Provider store={store}>
        {route}
    </Provider>
)

export default routes