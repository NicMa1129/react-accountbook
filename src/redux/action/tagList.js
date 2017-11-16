import { callApi } from 'common/base'
import * as actionTypes from './actionTypes'

export const fetchTagList = () => (dispatch) => {
    // let { list } = await callApi('../../static/data.json')
    // console.log(list)
    let list = []
    let data = JSON.parse(localStorage.getItem("tagList"))
    // console.log(data)
    if(data !== null){
        list = data.list
    }
    dispatch(fetchTagListSuccess(list))
}

export const fetchTagListSuccess = data => {
    return {
        type: actionTypes.FETCH_TAGLIST_SUCCESS,
        data
    }
}