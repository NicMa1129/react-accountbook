import React from 'react'
import PropTypes from 'prop-types'
class BackHeader extends React.Component {
    constructor(){
        super()
        this.goBack = this.goBack.bind(this)
    }

    goBack(){
        this.context.router.goBack()
    }

    render(){
        return (
            <header className="back-header flex-between">
                <i className="fa fa-chevron-left" aria-hidden="true" onClick={this.goBack}/>
                {this.props.children}
            </header>
        )
    }
}

BackHeader.contextTypes = {
    router: PropTypes.object.isRequired
}
export default BackHeader