import { accountList } from './accountBook'
import { tagList } from './tagList'
import { combineReducers } from 'redux'

const reduce = combineReducers({
    accountList,
    tagList
})

export default reduce