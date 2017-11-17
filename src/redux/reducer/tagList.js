import * as actionTypes from '../action/actionTypes'

const defaultState = {
    expense: [
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
    ],
    income: [
        {
            tagName: "工资",
            icon: "beer",
            color: "f6c87a",
            bakList: ["月份","预支","员工","微信"],
            selected: true
        },
        {
            tagName: "兼职",
            icon: "automobile",
            color: "a0df53",
            bakList: ["进货","成本","运费","快递"],
            selected: false
        },
        {
            tagName: "红包",
            icon: "mortar-board",
            color: "a587cf",
            bakList: ["生日","结婚","老公","礼物"],
            selected: false
        },
        {
            tagName: "投资",
            icon: "legal",
            color: "a3e4e6",
            bakList: ["彩票","定投","理财","保险"],
            selected: false
        },
        {
            tagName: "奖金",
            icon: "money",
            color: "f7957a",
            bakList: ["奖励","完成","垫付","晚餐"],
            selected: false
        }
    ]
}

const tagList = (state = defaultState, action = {}) => {
    switch(action.type){
        case actionTypes.FETCH_TAGLIST_SUCCESS: {
            return state
        }
        default:
            return state
    }
}

export {
    tagList
}