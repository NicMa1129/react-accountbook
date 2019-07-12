import "babel-polyfill"
import React from 'react'
import ReactDOM from 'react-dom'
import routes from './router'
import VConsole from 'vconsole'
import './static/style/main.scss'
import './static/lib/font-awesome-4.7.0/css/font-awesome.min.css'
var vConsole = new VConsole();
console.log('1 add by master')
console.log('2 add by master')
ReactDOM.render(
    routes,
    document.getElementById('root')
)