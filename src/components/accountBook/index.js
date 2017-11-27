import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { dateFormat, scrollThrottler } from 'common/base'
import Footer from 'components/Footer'
import Header from 'components/Header'
import ActionSheet from 'antd-mobile/lib/action-sheet'
import 'antd-mobile/lib/action-sheet/style/css'

require('./index.scss')

class AccountBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showTypeIn: false,
            scrollTimeout: null,
            fixedNum: 100,
            actionList: ['搜索账单', '共享此账本', '更换背景', '更多']
        }

        this.scrollThrottler = this.scrollThrottler.bind(this)
        this.actualScrollHandler = this.actualScrollHandler.bind(this)
        this.goItemDetail = this.goItemDetail.bind(this)
        this.showActionSheet = this.showActionSheet.bind(this)
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

    showActionSheet(){
        const BUTTONS = this.state.actionList
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                // cancelButtonIndex: BUTTONS.length - 1,
                // destructiveButtonIndex: BUTTONS.length - 2,
                // title: 'title',
                // message: '请选择账户',
                maskClosable: true,
                'data-seed': 'logId',
                // wrapProps,
            },
            buttonIndex => {
                switch(buttonIndex){
                    case 0:
                        this.context.router.push('/searchAccount')
                        break
                    default:
                        break
                }
            });
    }

    componentDidMount(){
        let list = this.refs.list

        list.addEventListener("scroll", this.scrollThrottler, false)
    }

    componentWillUnmount(){
        let list = this.refs.list
        list.removeEventListener("scroll", this.scrollThrottler, false)
    }

    componentWillReceiveProps(nextProps){

    }

    goItemDetail(e){
        let id = e.currentTarget.id
        this.context.router.push("/Detail/"+id)
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
                    <p>{this.props.accountList.mainInfo.income}</p>
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
                                        <span className="ex-in">
                                            {
                                                block.header.totalIncome !== 0 ? <span>
                                                    <p>收入：</p>
                                                    <p>{parseFloat(block.header.totalIncome).toFixed(2)}</p>
                                                    </span>:''
                                            }
                                            {
                                                block.header.totalExpense !== 0 ? <span className="header-expense">
                                                    <p>支出：</p>
                                                    <p>{parseFloat(block.header.totalExpense).toFixed(2)}</p>
                                                    </span>:''
                                            }
                                        </span>
                                    </div>
                                    <div className="list-block__body">
                                        <ul>
                                            {
                                                block.payList.map(
                                                    (item, i) => (
                                                        <li id={`${index}_${i}`} key={i} className="flex-between" onClick={this.goItemDetail}>
                                                            <label className="flex-center">
                                                                <i className={`tag-icon fa fa-${item.tag.icon}`} style={{color: `#${item.tag.color}`}} aria-hidden="true"/>
                                                                <span>
                                                                    <p className="type-name">{item.tag.tagName}</p>
                                                                    <p className="bak">{item.bak}</p>
                                                                </span>
                                                            </label>
                                                            <h3 className={`${item.isExpense?'':'is-expense'}`}>{item.payNum}</h3>
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
                        showTypeIn={this.showTypeIn}
                        showActionSheet={this.showActionSheet}/>
            </section>
        )
    }
}

AccountBook.contextTypes = {
    router: PropTypes.object.isRequired
}

export default AccountBook