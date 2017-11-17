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
            isExpense: true
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
        let { fetchTagList, tagList, fetchList } = this.props
        fetchTagList(true)
        fetchList()
        this.setState({
            tagList: tagList.expense
        })
    }

    componentDidMount(){
        let scrollWrap = document.querySelector(".tags-box")
        scrollWrap.addEventListener('touchstart', this.touchStart, false)
        scrollWrap.addEventListener('touchmove', this.touchMove, false)
        scrollWrap.addEventListener('touchend', this.touchEnd, false)
        scrollWrap.addEventListener('mousedown', this.touchStart, false)
        scrollWrap.addEventListener('mousemove', this.touchMove, false)
        scrollWrap.addEventListener('mouseup', this.touchEnd, false)
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
        let el = document.getElementById("expensesInput")
        el.value = value
    }
    keyBoradSubmit({value, date, bak}){
        let { addAccount } = this.props
        if(value > 0){
            let tagS = this.state.tagList.filter(tag => tag.selected === true)
            let tagText = tagS.length > 0 ? tagS[0].tagName : "呵呵"
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
        this.context.router.goBack()
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
        return (
            <section className="container-wrapper typein-container" >
                <CloseHeader close={this.close}>
                    <label className={`button-income tab-button ${this.state.isExpense?'':'selected'}`} onClick={this.addIncome}>收入</label>
                    <label className={`button-expense tab-button ${this.state.isExpense?'selected':''}`} onClick={this.addExpense}>支出</label>
                </CloseHeader>
                <div className="input-box flex-between" onClick={this.showKeyBoard}>
                    <span>
                        <i className={`tag-icon fa fa-${fliterTag[0].icon}`} aria-hidden="true" style={{color: `#${fliterTag[0].color}`}}/>
                        <p>{fliterTag[0].tagName}</p>
                    </span>
                    <input type="text" placeholder="0.00" id="expensesInput" readOnly={true}/>
                </div>
                <div className="tags-box">
                    <ul>{tagRow(this.state.tagList)}</ul>
                </div>
                <KeyBoard getValue={this.getKeyBoradRes}
                          submit={this.keyBoradSubmit}
                          show={this.state.keyBoardShow}
                          bakList={this.state.tagList.filter(tag => tag.selected === true)[0].bakList}/>
            </section>
        )
    }
}

TypeIn.contextTypes = {
    router: PropTypes.object.isRequired
}

export default TypeIn