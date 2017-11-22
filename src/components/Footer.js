import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'antd-mobile/lib/button'
import 'antd-mobile/lib/button/style/css'

class Footer extends Component {
    constructor(){
        super()
        this.state = {
            isClick: false
        }
        this.click = this.click.bind(this)
        this.goStatistics = this.goStatistics.bind(this)
    }

    click(){
        // document.documentElement.scrollTop = 0
        this.context.router.push("/typeIn")
    }

    goStatistics(){
        this.context.router.push("/statistics")
    }

    render(){
        return (
            <footer className="footer">
                <i className="fa fa-pie-chart" aria-hidden="true" onClick={this.goStatistics}/>
                <Button onClick={this.click}
                        disabled={this.state.isClick}
                        style={{lineHeight: '35px',
                                width: '50px',
                                height: '35px',
                                borderRadius: '5px',
                                textAlign: 'center',
                                background: '#f5a01f',
                                color: '#fff'}}>记</Button>
                <i className="fa fa-bars" aria-hidden="true" onClick={this.props.showActionSheet}/>
            </footer>
        )
    }
}
Footer.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Footer