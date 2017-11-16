import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group'
import CloseHeader from 'components/CloseHeader'
import KeyBoard from 'components/KeyBoard'
import Button from 'antd-mobile/lib/button'
import 'antd-mobile/lib/button/style/css'
require('./index.scss')

class TypeIn extends Component {
    constructor(){
        super()
        this.state = {
            keyBoardShow: false,
            tagList: [],
            selectedText: "吃喝"
        }
        this.hasTouch = 'ontouchstart' in window && !this.isTouchPad
        this.close = this.close.bind(this)
        this.getKeyBoradRes = this.getKeyBoradRes.bind(this)
        this.keyBoradSubmit = this.keyBoradSubmit.bind(this)
        this.radioOnChange = this.radioOnChange.bind(this)
        this.touchStart = this.touchStart.bind(this)
        this.touchMove = this.touchMove.bind(this)
        this.touchEnd = this.touchEnd.bind(this)
    }

    componentWillMount(){
        let { fetchTagList, tagList } = this.props
        fetchTagList()
        this.setState({
            tagList: tagList.list
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
                }
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
                this.setState({
                    selectedText: tag.tagName
                })
            }else{
                t = Object.assign(tag, {selected: false})
            }
            list.push(t)
        })
        this.setState({
            tagList: list
        })
    }

    render() {
        return (
            <section className="container-wrapper typein-container" >
                <CloseHeader close={this.close}/>
                <div className="input-box flex-between" onClick={this.showKeyBoard}>
                    <p>{this.state.selectedText}</p>
                    <input type="text" placeholder="0.00" id="expensesInput" readOnly={true}/>
                </div>
                <div className="tags-box">
                    {
                        this.props.tagList.list.map((tag, index) => {
                            return (
                                <span key={index} className="tag-item">
                                    <i className={`fa fa-${tag.icon}`} aria-hidden="true" style={{color: `#${tag.color}`}}/>
                                    <input type="radio" name="tags" value={index} hidden={true}/>
                                    <label className={`tag-sel ${tag.selected ? 'selected':''}`} onClick={this.radioOnChange}>{tag.tagName}</label>
                                </span>
                            )
                        })
                    }
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