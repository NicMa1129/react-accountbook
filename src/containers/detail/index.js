import React from 'react'
import { connect } from 'react-redux'
import {
    fetchList,
    delAccount
} from 'actions'
import Detail from 'components/detail'

const detailContainer = props => <Detail {...props}/>

const mapStateProps = state => {
    return {
        accountList: state.accountList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchList: () => {
            dispatch(fetchList())
        },
        delAccount: data => {
            dispatch(delAccount(data))
        }
    }
}

export default connect(mapStateProps, mapDispatchToProps)(detailContainer)