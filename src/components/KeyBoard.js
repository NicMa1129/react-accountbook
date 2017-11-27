import React, { Component } from 'react'
import Icon from 'antd-mobile/lib/icon'
import ActionSheet from 'antd-mobile/lib/action-sheet'
import DatePicker from 'antd-mobile/lib/date-picker'
import 'antd-mobile/lib/date-picker/style/css'
import 'antd-mobile/lib/icon/style/css'
import 'antd-mobile/lib/action-sheet/style/css'
import { TweenMove } from 'common/move'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

const formatDate = date => {
    let d = new Date(date)
    let month = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
    let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
    let res = month + "-" + day
    return res
}
const today = new Date()
class KeyBoard extends Component {
    constructor(){
        super()
        this.state = {
            value: "",
            lastValue: "",
            isPoint: false,
            isPlus: false,
            isDec: false,
            actionList: ['现金', '储蓄卡', '信用卡', '支付宝', '微信零钱'],
            accountType: "现金",
            curSelectDate: today,
            bak: "",
            isEdit: false
        }
        this.setValue = this.setValue.bind(this)
        this.click = this.click.bind(this)
        this.del = this.del.bind(this)
        this.commit = this.commit.bind(this)
        this.plus = this.plus.bind(this)
        this.dec = this.dec.bind(this)
        this.onEnter = this.onEnter.bind(this)
        this.onEntering = this.onEntering.bind(this)
        this.onEntered = this.onEntered.bind(this)
        this.onExit = this.onExit.bind(this)
        this.onExiting = this.onExiting.bind(this)
        this.onExited = this.onExited.bind(this)
        this.showActionSheet = this.showActionSheet.bind(this)
        this.datePickerOnChange = this.datePickerOnChange.bind(this)
        this.addBak = this.addBak.bind(this)
    }

    dec(){
        if(!this.state.isDec && !this.state.isPlus && this.state.value !== ""){
            this.setState({
                isDec: true,
                isPlus: false,
                lastValue: this.state.value,
                value: "",
                isPoint: false
            })
        }
    }

    plus(){
        if(!this.state.isPlus && !this.state.isDec && this.state.value !== ""){
            this.setState({
                isPlus: true,
                isDec: false,
                lastValue: this.state.value,
                value: "",
                isPoint: false
            })
        }
    }

    commit(){
        let curValue = (this.state.value.length !== 0 && this.state.value !== ".") ? this.state.value : 0
        let lastValue = (this.state.lastValue.length !== 0 && this.state.lastValue !== ".") ? this.state.lastValue : 0
        let res
        if(this.state.isPlus){
            this.setState({
                isPlus: false,
            })
            res = parseFloat(parseFloat(curValue) + parseFloat(lastValue)).toFixed(2)
            this.setValue(res)
            let s = res + ""
            let ret = s.includes(".") ? true : false
            this.setState({
                isPoint: ret
            })
        }else if(this.state.isDec){
            this.setState({
                isDec: false,
            })
            res = parseFloat(parseFloat(lastValue) - parseFloat(curValue)).toFixed(2)
            this.setValue(res)
            let s = res + ""
            let ret = s.includes(".") ? true : false
            this.setState({
                isPoint: ret
            })
        }else{
            let result = {
                value: this.state.value,
                date: this.state.curSelectDate,
                bak: this.state.bak,
                isEdit: this.state.isEdit
            }
            this.props.submit(result)
        }
    }

    setValue(val){
        let data = {}
        if(this.state.isPlus || this.state.isDec){
            data = {
                value: val
            }

        }else{
            data = {
                value: val,
                lastValue: val
            }
        }
        this.setState(data, () => {
            this.props.getValue(this.state.value)
        })
    }

    click(e){
        let res = this.state.value + ""
        let value = e.target.getAttribute("value")
        if(res.length === 0 && value === "."){
            res = "0"
        }
        if(value !== null && !(res.includes(".") && res.split(".")[1].length >= 2)){
            if(value !== "."){
                res += value
            }else{
                if(!this.state.isPoint){
                    res += value
                    this.setState({
                        isPoint: true
                    })
                }
            }
        }
        this.setValue(res)
    }

    del(e){
        let res = this.state.value + ""
        let r
        if(res.length > 0){
            if(res.substr(-2, 1) !== "."){
                r = res.slice(0, -1)
            }else{
                r = res.slice(0, -2)
                this.setState({
                    isPoint: false
                })
            }
            this.setValue(r)

        }
    }

    componentWillMount(){
        console.log("kb componentWillMount")
        let { defaultValue, defaultBak, defaultDate } = this.props
        console.log(this.props)
        if(defaultDate !== null){
            if(defaultValue !== 0){
                this.setState({
                    value: defaultValue
                })
            }
            this.setState({
                bak: defaultBak,
                curSelectDate: defaultDate,
                isEdit: true
            })
        }
    }

    componentDidMount(){
        console.log("kb componentDidMount")
    }

    componentWillReceiveProps(nextProps){
        console.log("kb componentWillReceiveProps")
        // let { defaultValue } = nextProps
        // this.setState({
        //     value: defaultValue
        // },() => {
        //     console.log(this.state.value)
        // })
    }

    onEnter(node){
        // console.log("onEnter")
        let h = node.clientHeight - 99
        // console.log(h)x
        node.style.bottom = `-${h}px`
    }

    onEntering(node){
        // console.log("onEntering")
        let h = node.clientHeight  - 99
        // console.log(h)
        node.style.bottom = `-${h}px`
    }

    onEntered(node){
        // console.log("onEntered")
        let h = node.clientHeight
        // console.log(h)
        node.style.bottom = "0"
    }

    onExit(node){
        // console.log("onExit")
        let h = node.clientHeight
        // console.log(h)
        node.style.bottom = "0"
    }
    onExiting(node){
        // console.log("onExiting")
        let h = node.clientHeight
        // console.log(h)
        node.style.bottom = "0"
    }
    onExited(node){
        // console.log("onExited")
        let h = node.clientHeight  - 99
        // console.log(h)
        node.style.bottom = `-${h}px`
    }

    showActionSheet(){
        const BUTTONS = this.state.actionList
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                // cancelButtonIndex: BUTTONS.length - 1,
                // destructiveButtonIndex: BUTTONS.length - 2,
                // title: 'title',
                message: '请选择账户',
                maskClosable: true,
                'data-seed': 'logId',
                // wrapProps,
            },
            (buttonIndex) => {
                this.setState({ accountType: BUTTONS[buttonIndex] });
            });
    }

    datePickerOnChange(date){
        this.setState({
            curSelectDate: date
        })
    }

    componentWillReceiveProps(nextProps){
        let wrap = document.querySelector(".tag-list__wrap")
        let width = 0
        nextProps.bakList.forEach(bak => {
            width = width + 70
        })
        wrap.style.width = width + "px"
        // console.log(nextProps)
        this.setState({
            bak: ""
        })
    }

    addBak(e){
        let target = e.target || e.srcElement
        let bak = target.innerText
        let bakBtn = this.refs.bak
        let vTag = document.createElement('div')
        let tagPanel = document.querySelector('.tag-panel')

        vTag.className = 'v-tag'
        vTag.style.top = target.offsetTop + 'px'
        vTag.style.left = target.offsetLeft + 'px'
        vTag.innerText = bak
        tagPanel.appendChild(vTag)

        let moveLeft = bakBtn.offsetLeft + bakBtn.offsetWidth / 2 - vTag.offsetWidth / 2
        let moveTop = bakBtn.offsetTop
        TweenMove(vTag,{left: moveLeft, top: moveTop, opacity: 0}, 500, 'Back-easeIn', () => {
            tagPanel.removeChild(tagPanel.childNodes[2])
        })

        if(!this.state.bak.includes(bak)){
            if(this.state.bak !== ""){
                bak = this.state.bak + " " + bak
            }
            this.setState({
                bak: bak
            })
        }
    }

    render(){
        const CustomChildren = ({ extra, onClick, children }) => (
            <a className="button" onClick={onClick}>{formatDate(this.state.curSelectDate)}</a>
        );

        return (
            <div className={`keyboard-container ${this.props.show ? "unshow" : ""}`}>
                <div className="tag-panel-box">
                    <div className="tag-panel">
                        <span className="tag-tool">标签</span>
                        <div className="tag-list">
                            <div className="tag-list__wrap">
                                {
                                    this.props.bakList.map((bak, index) => <a key={index} className="tag-sel" onClick={this.addBak}>{bak}</a>)
                                }
                            </div>
                        </div>
                    </div>
                    <div className="bak-panel flex-between">
                        <a className="button" onClick={this.showActionSheet}>{this.state.accountType || "现金"}</a>
                        <DatePicker
                                value={new Date(this.state.curSelectDate)}
                                maxDate={new Date()}
                                onChange={this.datePickerOnChange}
                                model="datetime">
                            <CustomChildren/>
                        </DatePicker>
                        <a className="button" ref="bak">{this.state.bak === "" ? "备注" : this.state.bak.length > 5 ? this.state.bak.substr(0, 5) + "..." : this.state.bak}</a>
                    </div>
                </div>
                <div className="keyboard-row">
                    <span className="keyboard-sel flex-center" value="7" onClick={this.click}>7</span>
                    <span className="keyboard-sel flex-center" value="8" onClick={this.click}>8</span>
                    <span className="keyboard-sel flex-center" value="9" onClick={this.click}>9</span>
                    <span className="keyboard-sel flex-center" onClick={this.del}>
                                <i/>
                                <div className="back-icon">
                                    <Icon type="cross"/>
                                </div>
                            </span>
                </div>
                <div className="keyboard-row">
                    <span className="keyboard-sel flex-center" value="4" onClick={this.click}>4</span>
                    <span className="keyboard-sel flex-center" value="5" onClick={this.click}>5</span>
                    <span className="keyboard-sel flex-center" value="6" onClick={this.click}>6</span>
                    <span className="keyboard-sel flex-center keyboard-sel-tool" onClick={this.plus}>+</span>
                </div>
                <div className="keyboard-row">
                    <span className="keyboard-sel flex-center" value="1" onClick={this.click}>1</span>
                    <span className="keyboard-sel flex-center" value="2" onClick={this.click}>2</span>
                    <span className="keyboard-sel flex-center" value="3" onClick={this.click}>3</span>
                    <span className="keyboard-sel flex-center keyboard-sel-tool" onClick={this.dec}>-</span>
                </div>
                <div className="keyboard-row">
                    <span className="keyboard-sel flex-center" value="." onClick={this.click}>.</span>
                    <span className="keyboard-sel flex-center" value={0} onClick={this.click}>0</span>
                    <span className="keyboard-double-sel flex-center keyboard-sel-tool" onClick={this.commit}>
                                {(this.state.isPlus || this.state.isDec) ? "=" : "OK"}
                            </span>
                </div>
            </div>
        )
    }
}

export default KeyBoard