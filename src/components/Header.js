import React, { Component } from 'react'
import Icon from 'antd-mobile/lib/icon'
import 'antd-mobile/lib/icon/style/css'

class Header extends Component {
    constructor(){
        super()
        this.state = {

        }

    }

    render(){
        return (
            <header className="flex-between title">
                <Icon type="bars"/>
                <p>{this.props.name}</p>
                <Icon type="bars"/>
            </header>
        )
    }
}

export default Header