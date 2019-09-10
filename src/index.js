import "babel-polyfill"
import React from 'react'
import ReactDOM from 'react-dom'
import routes from './router'
import VConsole from 'vconsole'
import './static/style/main.scss'
import './static/lib/font-awesome-4.7.0/css/font-awesome.min.css'
var vConsole = new VConsole();
console.log('1 update by test');
console.log('2 add by test');
console.log('3 add by test');
console.log('1 add by test2');
console.log('2 add by test2');
console.log('3 add by test2');
console.log('4 add by test2');
console.log('5 add by test2');
ReactDOM.render(
    routes,
    document.getElementById('root')
)