import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CloseHeader from 'components/CloseHeader'
import KeyBoard from 'components/KeyBoard'
require('./index.scss')

class TypeIn extends Component {
    constructor(){
        super()
        this.state = {
            keyBoardShow: false,
            tagList: [],
            selectedText: "吃喝",
            isExpense: true,
            defaultValue: 0,
            curValue: 0,
            defaultBak: "",
            defaultDate: null,
            blockIndex: null,
            itemIndex: null
        }
        this.hasTouch = 'ontouchstart' in window && !this.isTouchPad
        this.close = this.close.bind(this)
        this.getKeyBoradRes = this.getKeyBoradRes.bind(this)
        this.keyBoradSubmit = this.keyBoradSubmit.bind(this)
        this.radioOnChange = this.radioOnChange.bind(this)
        this.touchStart = this.touchStart.bind(this)
        this.touchMove = this.touchMove.bind(this)
        this.touchEnd = this.touchEnd.bind(this)
        this.addExpense = this.addExpense.bind(this)
        this.addIncome = this.addIncome.bind(this)
    }

    componentWillMount(){
        console.log("typein componentWillMount")
        let { fetchTagList, tagList, params, accountList } = this.props
        let { blockId, itemId } = params
        let defaultItem = blockId?accountList.list[blockId].payList[itemId]:null
        if(defaultItem !== null){
            if(defaultItem.isExpense){
                tagList = tagList.expense
            }else{
                tagList = tagList.income
            }
            tagList.forEach(tag => {
                if(tag.tagName === defaultItem.tag.tagName){
                    tag.selected = true
                }else{
                    tag.selected = false
                }
            })
        }else{
            tagList = tagList.expense
        }
        this.setState({
            tagList: tagList,
            defaultValue: defaultItem !== null?defaultItem.payNum:0,
            curValue: defaultItem !== null?defaultItem.payNum:0,
            isExpense: defaultItem !== null?defaultItem.isExpense:true,
            defaultBak: defaultItem !== null?defaultItem.bak:"",
            defaultDate: defaultItem !== null?accountList.list[blockId].header.date:null,
            blockIndex: defaultItem !== null?blockId:null,
            itemIndex: defaultItem !== null?itemId:null
        })
    }

    componentDidMount(){
        console.log("typein componentDidMount")
        let scrollWrap = document.querySelector(".tags-box")
        scrollWrap.addEventListener('touchstart', this.touchStart, false)
        scrollWrap.addEventListener('touchmove', this.touchMove, false)
        scrollWrap.addEventListener('touchend', this.touchEnd, false)
        scrollWrap.addEventListener('mousedown', this.touchStart, false)
        scrollWrap.addEventListener('mousemove', this.touchMove, false)
        scrollWrap.addEventListener('mouseup', this.touchEnd, false)
    }

    componentWillReceiveProps(nextProps){
        console.log("typein componentWillReceiveProps")

    }

    // componentWillUnmount(){
    //     let scrollWrap = document.querySelector(".tags-box")
    //     scrollWrap.removeEventListener('touchstart', this.touchStart, false)
    //     scrollWrap.removeEventListener('touchmove', this.touchMove, false)
    //     scrollWrap.removeEventListener('touchend', this.touchEnd, false)
    //     scrollWrap.removeEventListener('mousedown', this.touchStart, false)
    //     scrollWrap.removeEventListener('mousemove', this.touchMove, false)
    //     scrollWrap.removeEventListener('mouseup', this.touchEnd, false)
    // }

    touchStart(e){
        let el = e.target
        if(el.tagName !== 'LABEL'){
            let even = typeof event == "undefined" ? e : event
            this.start = this.hasTouch ? even.touches[0].pageY : even.pageY
        }
    }

    touchMove(e){
        let el = e.target
        if(el.tagName !== 'LABEL'){
            let even = typeof event == "undefined" ? e : event;
            //保存当前鼠标Y坐标
            this.end = this.hasTouch ? even.touches[0].pageY : even.pageY;
        }
    }

    touchEnd(e){
        let el = e.target
        if(el.tagName !== 'LABEL'){
            if(this.end - this.start > 20){
                this.setState({
                    keyBoardShow: false
                })
            }else if(this.start - this.end > 20){
                this.setState({
                    keyBoardShow: true
                })
            }
        }
    }

    close(){
        this.context.router.goBack()
    }
    getKeyBoradRes(value){
        this.setState({
            curValue: value
        })
    }
    keyBoradSubmit({value, date, bak, isEdit}){
        let { addAccount, editAccount, delSearchRes } = this.props
        let tagS = this.state.tagList.filter(tag => tag.selected === true)
        let tagText = tagS.length > 0 ? tagS[0].tagName : "呵呵"
        if(isEdit){
            editAccount({
                blockIndex: this.state.blockIndex,
                itemIndex: this.state.itemIndex,
                value: value,
                date: date,
                bak: bak,
                tag: {
                    tagName: tagText,
                    icon: tagS[0].icon,
                    color: tagS[0].color
                },
                isExpense: this.state.isExpense
            })
        }else{
            if(value > 0){
                addAccount({
                    value: value,
                    date: date,
                    bak: bak,
                    tag: {
                        tagName: tagText,
                        icon: tagS[0].icon,
                        color: tagS[0].color
                    },
                    isExpense: this.state.isExpense
                })
            }
        }
        delSearchRes()
        this.context.router.push('/accountbook')
    }

    radioOnChange(e){
        let el = e.target
        let radio = el.previousElementSibling
        radio.checked = true
        let list = []
        let t = {}
        this.state.tagList.forEach((tag, index) => {
            if(index == radio.value){
                t = Object.assign(tag, {selected: true})
            }else{
                t = Object.assign(tag, {selected: false})
            }
            list.push(t)
        })
        this.setState({
            tagList: list
        })
    }

    addExpense(){
        if(!this.state.isExpense){
            this.setState({
                isExpense: true,
                tagList: this.props.tagList.expense
            })
        }
    }

    addIncome(){
        if(this.state.isExpense){
            this.setState({
                isExpense: false,
                tagList: this.props.tagList.income
            })
        }
    }

    render() {
        const fliterTag = this.state.tagList.filter(tag => tag.selected === true)


        const tagRow = list => {
            if(list.length !== 0){
                let rows = Math.ceil(list.length / 5)
                let lis = []
                for(let i = 0; i < rows; i++){
                    let cels = []
                    list.forEach((item, j) => {
                        if((j < (i+1)*5) && (j >= i*5)){
                            cels.push(<span key={j} className="tag-item">
                                    <i className={`tag-icon fa fa-${item.icon}`} aria-hidden="true" style={{color: `#${item.color}`}}/>
                                    <input type="radio" name="tags" value={j} hidden={true}/>
                                    <label className={`${item.selected ? 'selected':''}`} onClick={this.radioOnChange}>{item.tagName}</label>
                                </span>)
                        }
                    })
                    lis.push(<li className="tag-row flex-between" key={i}>{cels}</li>)
                }
                return lis
            }
            return ""
        }
        return (
            <section className="container-wrapper typein-container" >
                <CloseHeader close={this.close}>
                    <label className={`button-income tab-button ${this.state.isExpense?'':'selected'}`} onClick={this.addIncome}>收入</label>
                    <label className={`button-expense tab-button ${this.state.isExpense?'selected':''}`} onClick={this.addExpense}>支出</label>
                </CloseHeader>
                <div className="input-box flex-between" onClick={this.showKeyBoard}>
                    <span>
                        <i className={`tag-icon fa fa-${this.state.tagList.length !== 0?fliterTag[0].icon:''}`} aria-hidden="true" style={{color: `#${this.state.tagList.length !== 0?fliterTag[0].color:''}`}}/>
                        <p>{this.state.tagList.length !== 0?fliterTag[0].tagName:''}</p>
                    </span>
                    <input type="text" placeholder="0.00" id="expensesInput" readOnly={true} value={this.state.curValue}/>
                </div>
                <div className="tags-box">
                    <ul>{tagRow(this.state.tagList)}</ul>
                </div>
                <KeyBoard getValue={this.getKeyBoradRes}
                          submit={this.keyBoradSubmit}
                          show={this.state.keyBoardShow}
                          bakList={this.state.tagList.length !== 0?this.state.tagList.filter(tag => tag.selected === true)[0].bakList:[]}
                          defaultValue={this.state.defaultValue}
                            defaultBak={this.state.defaultBak}
                        defaultDate={this.state.defaultDate}/>
            </section>
        )
    }
}

TypeIn.contextTypes = {
    router: PropTypes.object.isRequired
}

export default TypeIn