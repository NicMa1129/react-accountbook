import React from 'react'
import { connect } from 'react-redux'
import Statistics from 'components/statistics'
import { fetchList } from 'actions'
const statisticsContainer = props => <Statistics {...props}/>

const mapStateProps = state => {
    return {
        accountList: state.accountList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchList: () => {
            dispatch(fetchList())
        }
    }
}

export default connect(mapStateProps, mapDispatchToProps)(statisticsContainer)