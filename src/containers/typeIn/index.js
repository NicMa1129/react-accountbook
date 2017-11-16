import React from 'react'
import { connect } from 'react-redux'
import {
    addAccount,
    fetchTagList
} from 'actions'
import TypeIn from 'components/typeIn'

const typeInContainer = props => <TypeIn {...props}/>

const mapStateProps = state => {
    return {
        accountList: state.accountList,
        tagList: state.tagList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addAccount: data => {
            dispatch(addAccount(data))
        },
        fetchTagList: () => {
            dispatch(fetchTagList())
        }
    }
}

export default connect(mapStateProps, mapDispatchToProps)(typeInContainer)