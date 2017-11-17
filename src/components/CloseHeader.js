import React from 'react'
import Icon from 'antd-mobile/lib/icon'
import 'antd-mobile/lib/icon/style/css'

class CloseHeader extends React.Component {
    render(){
        return (
            <header className="close-header flex-center">
                {this.props.children}
                <Icon type="cross" className="close" onClick={this.props.close}/>
            </header>
        )
    }
}
export default CloseHeader