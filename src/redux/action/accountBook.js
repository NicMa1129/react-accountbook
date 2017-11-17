import { callApi } from 'common/base'
import * as actionTypes from './actionTypes'

export const fetchList = () => dispatch => {
    // let { list } = await callApi('../../static/data.json')
    // console.log(list)
    let list = []
    let data = JSON.parse(localStorage.getItem("data"))
    // console.log(data)
    if(data !== null){
        list = data.list
    }
    dispatch(fetchListSuccess(list))
}

export const addAccount = ({value, date, bak, tag, isExpense}) => {
    return {
        type: actionTypes.ADD_ACCOUNT,
        value,
        date,
        bak,
        tag,
        isExpense
    }
}

export const fetchListSuccess = (data) => {
    return {
        type: actionTypes.FETCH_LIST_SUCCESS,
        data
    }
}