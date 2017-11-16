import * as actionTypes from '../action/actionTypes'

const defaultState = {
    list: [
        {
            tagName: "吃喝",
            icon: "beer",
            color: "f6c87a",
            bakList: ["水果","午餐","早餐","晚餐"],
            selected: true
        },
        {
            tagName: "交通",
            icon: "automobile",
            color: "a0df53",
            bakList: ["公交","打车","加油","停车费"],
            selected: false
        },
        {
            tagName: "服饰",
            icon: "mortar-board",
            color: "a587cf",
            bakList: ["衣服","鞋子","裤子","内衣"],
            selected: false
        },
        {
            tagName: "日用品",
            icon: "legal",
            color: "a3e4e6",
            bakList: ["超时","纸巾","牙套","毛巾"],
            selected: false
        },
        {
            tagName: "其他",
            icon: "money",
            color: "f7957a",
            bakList: ["快递","还款","电费","手机"],
            selected: false
        }
    ]
}

const tagList = (state = defaultState, action = {}) => {
    switch(action.type){
        case actionTypes.FETCH_TAGLIST_SUCCESS: {
            return {
                list: [...state.list, ...action.data]
            }
        }
        default:
            return state
    }
}

export {
    tagList
}