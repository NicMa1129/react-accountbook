import React from 'react'
import { connect } from 'react-redux'
import {
    addAccount,
    fetchList
} from 'actions'
import AccountBook from 'components/accountBook'

const accountBookContainer = props => <AccountBook {...props}/>

const mapStateProps = state => {
    return {
        accountList: state.accountList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addAccount: () => {
            dispatch(addAccount())
        },
        fetchList: () => {
            dispatch(fetchList())
        }
    }
}

export default connect(mapStateProps, mapDispatchToProps)(accountBookContainer)