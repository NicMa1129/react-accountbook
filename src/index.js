import "babel-polyfill"
import React from 'react'
import ReactDOM from 'react-dom'
import routes from './router'
import VConsole from 'vconsole'
import './static/style/main.scss'
import './static/lib/font-awesome-4.7.0/css/font-awesome.min.css'
var vConsole = new VConsole();
console.log('test1')
console.log('test2')
console.log('test3')
console.log('test4')
console.log('test6')
console.log('test5')
console.log('test7')
console.log('test8')
console.log('test9')
ReactDOM.render(
    routes,
    document.getElementById('root')
)