import React from 'react'
import { connect } from 'react-redux'
import Statistics from 'components/statistics'

const statisticsContainer = props => <Statistics {...props}/>

const mapStateProps = state => {
    return {
        accountList: state.accountList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // addAccount: () => {
        //     dispatch(addAccount())
        // }
    }
}

export default connect(mapStateProps, mapDispatchToProps)(statisticsContainer)