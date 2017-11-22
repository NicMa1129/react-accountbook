import React from 'react'
import { connect } from 'react-redux'
import {
    fetchList
} from 'actions'
import SearchAccount from 'components/searchAccount'

const searchAccountContainer = props => <SearchAccount {...props}/>

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

export default connect(mapStateProps, mapDispatchToProps)(searchAccountContainer)