import React from 'react'
import { connect } from 'react-redux'
import {
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
        fetchList: () => {
            dispatch(fetchList())
        }
    }
}

export default connect(mapStateProps, mapDispatchToProps)(accountBookContainer)