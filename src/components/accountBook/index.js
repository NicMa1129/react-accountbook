import React, { Component } from 'react'
import { dateFormat, scrollThrottler } from 'common/base'
import Footer from 'components/Footer'
import Header from 'components/Header'
import { Transition } from 'react-transition-group'

require('./index.scss')

class AccountBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showTypeIn: false,
            scrollTimeout: null,
            fixedNum: 100
        }

        this.scrollThrottler = this.scrollThrottler.bind(this)
        this.actualScrollHandler = this.actualScrollHandler.bind(this)
    }

    componentWillMount(){
        let { fetchList } = this.props
        fetchList()
    }

    actualScrollHandler(){
        let elBody = document.querySelectorAll(".list-block__body")
        let elList = Array.from(elBody)
        let mainHead = document.querySelector(".main-head")
        let curBody, curHeader, headerP, preHeader, elTop
        // console.log(elList)
        for(let i = 0; i < elList.length; i++){
            curBody = elList[i]//当前接近顶部的block_body
            curHeader = curBody.previousElementSibling//当前接近顶部的block_header
            headerP = curHeader.previousElementSibling//当前接近顶部的占位header
            preHeader = i > 0 ? elList[i - 1].previousElementSibling:null//当前接近顶部的header的前一个header
            elTop = curBody.getBoundingClientRect().top

            // console.log("第" + i + "个header的top是： " + elTop)
            if(elTop <= curHeader.clientHeight + mainHead.clientHeight && elTop > mainHead.clientHeight){//向上滚动时当前block的header fixed
                if(!curHeader.classList.contains("fixed")){
                    curHeader.classList.add("fixed")
                    curHeader.style.top = mainHead.clientHeight + "px"
                    headerP.classList.add("fixed")
                    if(preHeader !== null && preHeader.classList.contains("fixed")){
                        preHeader.classList.remove("fixed")
                    }
                }
                break
            }else if(elTop > curHeader.clientHeight + mainHead.clientHeight){//向下滚动时当前block的header回归原状态
                if(curHeader.classList.contains("fixed")){
                    curHeader.classList.remove("fixed")
                    headerP.classList.remove("fixed")
                    if(preHeader !== null && !preHeader.classList.contains("fixed")){
                        preHeader.classList.add("fixed")
                    }
                }
                break
            }
        }
        this.scrollTimeout = false
    }

    scrollThrottler(){
        if (!this.scrollTimeout) {
            requestAnimationFrame(this.actualScrollHandler)
            this.scrollTimeout = true
        }
    }
    // scrollThrottler(){
    //     if (!this.scrollTimeout) {
    //         this.scrollTimeout = setTimeout(() => {
    //             this.scrollTimeout = null;
    //             this.actualScrollHandler();
    //         }, 17);
    //     }
    // }

    componentDidMount(){
        let head = document.querySelector(".main-head")
        head.classList.add("fixed")

        window.addEventListener("scroll", this.scrollThrottler, false)
    }

    componentWillUnmount(){
        window.removeEventListener("scroll", this.scrollThrottler, false)
    }

    componentWillReceiveProps(nextProps){

    }

    render(){
        const Budget = props => (
            <div className="budget-box">
                <h2>{this.props.accountList.mainInfo.totalBudget}</h2>
                <h5>11月预算结余</h5>
            </div>
        )
        const LastTotal = props => (
            <div className="lasttotal-box flex-between">
                <div>
                    <p>0</p>
                    <p>{this.props.accountList.mainInfo.lastDate}月收入</p>
                </div>
                <span className="line"/>
                <div>
                    <p>{this.props.accountList.mainInfo.expenses}</p>
                    <p>{this.props.accountList.mainInfo.lastDate}月支出</p>
                </div>
            </div>
        )
        return (
            <section className="container-wrapper accountbook-container">
                <div className="main-head">
                    <Header name="nic"/>
                    <Budget/>
                    <LastTotal/>
                </div>
                <div className="list" ref="list" id="list">
                    {
                        this.props.accountList.list.length !== 0 ? this.props.accountList.list.map(
                            (block, index) => (
                                <div className="list-block" key={index}>
                                    <div className="header-p"></div>
                                    <div className="list-block__header">
                                        <p>{dateFormat(block.header.date)}</p>
                                        <span>
                                            <p>支出：</p>
                                            <p>{block.header.total}</p>
                                        </span>
                                    </div>
                                    <div className="list-block__body">
                                        <ul>
                                            {
                                                block.payList.map(
                                                    (item, i) => (
                                                        <li key={i} className="flex-between">
                                                            <label className="flex-center">
                                                                <i className={`fa fa-${item.tag.icon}`} style={{color: `#${item.tag.color}`}} aria-hidden="true"/>
                                                                <span>
                                                                    <p className="type-name">{item.tag.tagName}</p>
                                                                    <p className="bak">{item.bak}</p>
                                                                </span>
                                                            </label>
                                                            <h3>{item.payNum}</h3>
                                                        </li>
                                                    )
                                                )
                                            }
                                        </ul>
                                    </div>
                                </div>
                            )
                        ) : ""
                    }
                </div>
                <Footer doRecordCb={this.props.addAccount}
                        showTypeIn={this.showTypeIn}/>
            </section>
        )
    }
}

export default AccountBook