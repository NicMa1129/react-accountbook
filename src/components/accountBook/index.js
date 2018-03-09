import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { dateFormat, scrollThrottler } from 'common/base'
import Footer from 'components/Footer'
import Header from 'components/Header'
import ActionSheet from 'antd-mobile/lib/action-sheet'
import BScroll from 'better-scroll'
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

    actualScrollHandler(pos){
        let scrollY = Math.abs(Math.ceil(pos.y))
        if(scrollY !== this.lastPosY){
            // console.log(scrollY)
            if(scrollY > this.lastPosY){//向上滑
                let totalH = 0
                for(let i = 0; i < this.listBlocksH.length; i++){
                    totalH = totalH + this.listBlocksH[i]
                    if(scrollY <= totalH && (i === 0 || scrollY > totalH - this.listBlocksH[i - 1])){
                        let curBlock = this.listBlocksArr[i]
                        let curHeaderP = curBlock.firstElementChild
                        let curHeader = curHeaderP.nextElementSibling

                        if(!curHeaderP.classList.contains("fixed")){
                            curHeaderP.classList.add("fixed")
                            curHeader.classList.add("fixed")
                            if(i !== 0){
                                let preBlock = this.listBlocksArr[i - 1]
                                let preHeaderP = preBlock.firstElementChild
                                let preHeader = preHeaderP.nextElementSibling

                                preHeaderP.classList.remove("fixed")
                                preHeader.classList.remove("fixed")
                            }

                        }
                        curHeader.style.top = scrollY + "px"
                        break
                    }
                }
            }else{//向下滑
                let totalH = this.listBlocksTotalH
                for(let i = this.listBlocksH.length - 1; i >= 0; i--){
                    totalH = totalH - this.listBlocksH[i]
                    if(scrollY <= totalH + this.listBlocksH[i + 1] && (scrollY > totalH)){
                        let curBlock = this.listBlocksArr[i]
                        let curHeaderP = curBlock.firstElementChild
                        let curHeader = curHeaderP.nextElementSibling

                        let preBlock = i !== 0 ?this.listBlocksArr[i - 1]:null
                        let preHeaderP = i !== 0 ? preBlock.firstElementChild:null
                        let preHeader = i !== 0 ? preHeaderP.nextElementSibling:null

                        if(curHeaderP.classList.contains("fixed")){
                            curHeaderP.classList.remove("fixed")
                            curHeader.classList.remove("fixed")

                            if(i !== 0){
                                preHeaderP.classList.add("fixed")
                                preHeader.classList.add("fixed")
                            }
                        }
                        if(preHeader !== null){
                            preHeader.style.top = scrollY + "px"
                        }
                        break
                    }
                }
            }
            this.lastPosY = scrollY
        }
        this.scrollTimeout = false
    }

    // scrollThrottler(){
    //     if (!this.scrollTimeout) {
    //         requestAnimationFrame(this.actualScrollHandler)
    //         this.scrollTimeout = true
    //     }
    // }
    scrollThrottler(){
        if (!this.scrollTimeout) {
            this.scrollTimeout = setTimeout(() => {
                this.scrollTimeout = null;
                this.actualScrollHandler();
            }, 17);
        }
    }

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
                    case 1:
                        this.context.router.push('/nativeScroll')
                        break
                    default:
                        break
                }
            });
    }

    componentDidMount(){
        console.log("222")
        let list = this.refs.list
        let head = document.querySelector(".main-head")
        let footer = document.querySelector(".footer")
        list.style.height = window.innerHeight - head.clientHeight - footer.clientHeight + "px"
        // list.addEventListener("scroll", this.scrollThrottler, false)
    }

    componentWillUnmount(){
        // let list = this.refs.list
        // list.removeEventListener("scroll", this.scrollThrottler, false)
    }

    componentWillReceiveProps(nextProps){
        console.log("333")
    }

    componentWillUpdate(nextProps, nextState){
        console.log("444")
    }

    componentDidUpdate(){
        console.log("555")
        let { accountList } = this.props

        if(accountList.list.length > 0){
            this.listBlocksH = []
            this.lastPosY = 0
            this.listBlocksTotalH = 0
            let listBlocks = document.querySelectorAll(".list-block")
            this.listBlocksArr = Array.from(listBlocks)
            this.listBlocksArr.forEach(block => {
                this.listBlocksH.push(block.clientHeight)
                this.listBlocksTotalH = this.listBlocksTotalH + block.clientHeight
            })
            this.scrollWrap = new BScroll(this.refs.list, {
                click: true,
                probeType: 3
            })
            this.scrollWrap.on('scroll', pos => {
                if (!this.scrollTimeout) {
                    this.scrollTimeout = setTimeout(() => {
                        this.scrollTimeout = null;
                        this.actualScrollHandler(pos);
                    }, 17);
                }
            })
        }
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
                    <ul ref="content">
                        {
                            this.props.accountList.list.length !== 0 ? this.props.accountList.list.map(
                                (block, index) => (
                                    <li className="list-block" key={index}>
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
                                                            <li id={`${index}_${i}`} key={i} className="flex-between"b onClick={this.goItemDetail}>
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
                                    </li>
                                )
                            ) : ""
                        }
                    </ul>
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