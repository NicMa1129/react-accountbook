import * as actionTypes from '../action/actionTypes'
import { dateFormat, encryptSave } from 'common/base'

const TOTALBUDGET = 5000
const defaultState = {
    list: [],
    mainInfo: {
        headerName: "nic",
        totalBudget: TOTALBUDGET
    }
}

const getTotal = list => {
    let res = 0
    list.forEach(item => {
        res = parseFloat(parseFloat(res) + parseFloat(item.payNum)).toFixed(2)
    })
    return res
}

const getBudget = (list, expenses = false) => {
    let curYear = new Date().getFullYear()
    let curMonth = new Date().getMonth()
    let res = list.filter(block => {
        return (curYear === new Date(block.header.date).getFullYear() && curMonth === new Date(block.header.date).getMonth())
    })
    let budget = 0
    if(res.length > 0){
        res.forEach( block => {
            block.payList.forEach( item => {
                budget += parseFloat(item.payNum)
            })
        })
    }
    if(expenses){
        if(res.length === 0){
            if(list.length !== 0){
                list[0].payList.forEach(item => {
                    budget += parseFloat(item.payNum)
                })
            }
        }
        return budget.toFixed(2)
    }
    return TOTALBUDGET - parseFloat(budget).toFixed(2)
}

const listSort = list => list.sort((a, b) => new Date(b.header.date).getTime() - new Date(a.header.date).getTime())

const accountList = (state = defaultState, action = {}) => {
    switch(action.type){
        case actionTypes.FETCH_LIST_SUCCESS: {
            let list = [...action.data]
            let lastMonth = list.length !== 0 ? new Date(list[0].header.date).getMonth() : 0
            return {
                list: list,
                mainInfo: {
                    headerName: state.mainInfo.headerName,
                    totalBudget: getBudget(list),
                    lastDate: lastMonth + 1,
                    expenses: getBudget(list, true)
                }
            }
        }
        case actionTypes.ADD_ACCOUNT: {
            let todayStr = dateFormat(action.date)
            let curMonth = new Date().getMonth()
            if(state.list.length !== 0){
                let r = state.list.filter( block => todayStr === dateFormat(block.header.date))//查找是否有今天的block记录
                if(r.length === 0){//没有今天的记录
                    let list = [{
                        header: {
                            date: action.date,
                            total: action.value
                        },
                        payList: [{
                            tag: action.tag,
                            payNum: action.value,
                            bak: action.bak

                        }]
                    }, ...state.list]
                    let data = {
                        list: listSort(list),
                        mainInfo: {
                            headerName: state.mainInfo.headerName,
                            totalBudget: getBudget(list),
                            lastDate: curMonth + 1,
                            expenses: getBudget(list, true)
                        }
                    }
                    localStorage.setItem("data", JSON.stringify(data))
                    return data
                }else{//有今天的记录
                    let blockList = state.list.map(block => {
                        if(dateFormat(block.header.date) === todayStr){
                            block.payList.unshift({
                                tag: action.tag,
                                payNum: action.value,
                                bak: action.bak
                            })
                            block.header.total = getTotal(block.payList)
                        }
                        return block
                    })
                    let data = {
                        list: [...blockList],
                        mainInfo: {
                            headerName: state.mainInfo.headerName,
                            totalBudget: getBudget(blockList),
                            lastDate: curMonth + 1,
                            expenses: getBudget(blockList, true)
                        }
                    }
                    localStorage.setItem("data", JSON.stringify(data))
                    return data
                }
            }else{
                let list = [{
                    header: {
                        date: action.date,
                        total: action.value
                    },
                    payList: [{
                        tag: action.tag,
                        payNum: action.value,
                        bak: action.bak
                    }]
                }]
                let data = {
                    list: list,
                    mainInfo: {
                        headerName: "nic",
                        totalBudget: getBudget(list),
                        lastDate: curMonth + 1,
                        expenses: getBudget(list, true)
                    }
                }
                localStorage.setItem("data", JSON.stringify(data))
                return data
            }
        }
        default:
            return state;
    }
}

export {
    accountList
}