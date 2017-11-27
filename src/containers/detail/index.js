import React from 'react'
import { connect } from 'react-redux'
import {
    fetchList,
    delAccount,
    delSearchRes
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
        },
        delSearchRes: () => {
            dispatch(delSearchRes())
        }
    }
}

export default connect(mapStateProps, mapDispatchToProps)(detailContainer)