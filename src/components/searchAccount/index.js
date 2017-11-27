import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SearchBar from 'antd-mobile/lib/search-bar'
import 'antd-mobile/lib/search-bar/style/css'
import { dateFormat } from 'common/base'
require('./index.scss')

const getTotal = list => {
    let res = 0
    list.forEach(block => {
        block.list.forEach(item => {
            res = res + parseFloat(item.item.payNum)
        })
    })
    return res.toFixed(2)
}

class SearchAccount extends Component {
    constructor(){
        super()
        this.state = {
            showRes: false,
            res: [],
            searchValue: ""
        }
        this.goBack = this.goBack.bind(this)
        this.searchChange = this.searchChange.bind(this)
        this.search = this.search.bind(this)
        this.tagSearch = this.tagSearch.bind(this)
        this.windowClick = this.windowClick.bind(this)
        this.goItemDetail = this.goItemDetail.bind(this)
        this.actualScrollHandler = this.actualScrollHandler.bind(this)
        this.scrollThrottler = this.scrollThrottler.bind(this)
    }

    componentWillMount(){
        // console.log(this.props.location)
    }

    actualScrollHandler(){
        let elBody = document.querySelectorAll(".res-item__list")
        let elList = Array.from(elBody)
        let serachPanel = document.querySelector(".am-search")
        let mainHead = document.querySelector(".res-total-header")
        let curBody, curHeader, headerP, preHeader, elTop
        for(let i = 0; i < elList.length; i++){
            curBody = elList[i]//当前接近顶部的block_body
            curHeader = curBody.previousElementSibling//当前接近顶部的block_header
            headerP = curHeader.previousElementSibling//当前接近顶部的占位header
            preHeader = i > 0 ? elList[i - 1].previousElementSibling:null//当前接近顶部的header的前一个header
            elTop = curBody.getBoundingClientRect().top

            // console.log("第" + i + "个header的top是： " + elTop)
            if(elTop <= curHeader.clientHeight + mainHead.clientHeight + serachPanel.clientHeight && elTop > mainHead.clientHeight + serachPanel.clientHeight){//向上滚动时当前block的header fixed
                if(!curHeader.classList.contains("fixed")){
                    curHeader.classList.add("fixed")
                    curHeader.style.top = mainHead.clientHeight + serachPanel.clientHeight + "px"
                    headerP.classList.add("fixed")
                    if(preHeader !== null && preHeader.classList.contains("fixed")){
                        preHeader.classList.remove("fixed")
                    }
                }
                break
            }else if(elTop > curHeader.clientHeight + mainHead.clientHeight + serachPanel.clientHeight){//向下滚动时当前block的header回归原状态
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

    componentDidMount(){
        this.autoFocusInst.focus();
        window.addEventListener('click', this.windowClick, false)
    }

    componentWillUnmount(){
        window.removeEventListener('click', this.windowClick, false)
    }

    componentWillReceiveProps(nextProps){

    }

    componentDidUpdate(){
        let list = this.refs.list
        if(this.state.res.length > 0){
            list.removeEventListener("scroll", this.scrollThrottler, false)
            list.addEventListener("scroll", this.scrollThrottler, false)
        }
    }

    windowClick(e){
        e.preventDefault()
        this.autoFocusInst.focus();
    }

    goBack(){
        this.context.router.goBack()
    }

    searchChange(val){
        if(val !== ""){
            let res = this.search(val)
            this.setState({
                showRes: true,
                res: res,
                searchValue: val
            })
        }

        if(val === "" && this.state.showRes === true){
            this.setState({
                res: [],
                showRes: false,
                searchValue: val
            })
        }
    }

    search(val){
        let { accountList } = this.props
        let list = accountList.list.slice()
        let res = []
        list.forEach((block, i) => {
            block.payList.forEach((item, j) => {
                if(item.payNum === val || item.bak.includes(val) || item.tag.tagName === val){
                    if(res.length === 0){
                        res.push({
                            date: block.header.date,
                            list: [{
                                id: i +'_'+j,
                                item: item
                            }]
                        })
                    }else{
                        let r = res.filter( m => dateFormat(block.header.date) === dateFormat(m.date))
                        if(r.length === 0){
                            res.push({
                                date: block.header.date,
                                list: [{
                                    id: i +'_'+j,
                                    item: item
                                }]
                            })
                        }else{
                            for(let n = 0; n < res.length; n++){
                                if(dateFormat(res[n].date) === dateFormat(block.header.date)){
                                    res[n].list.push({
                                        id: i+'_'+j,
                                        item: item
                                    })
                                }
                            }
                        }
                    }
                }
            })
        })
        res = res.sort((a, b) => a.date < b.date)
        // console.log(res)
        return res
    }

    tagSearch(e){
        e.preventDefault()
        let val = e.target.attributes[1].value
        this.autoFocusInst.focus()
        this.searchChange(val)
        this.setState({
            searchValue: val
        })
    }

    goItemDetail(e){
        let id = e.currentTarget.id
        this.context.router.push("/Detail/"+id)
        // this.context.router.pushState({op: true}, '/Detail/'+id)
    }

    render(){
        return (
            <section className="container-wrapper searchaccount-container">
                <SearchBar placeholder="类别/备注/金额"
                           ref={ref => this.autoFocusInst = ref}
                           onCancel={this.goBack}
                            onChange={this.searchChange}
                            value={this.state.searchValue}/>
                <div className="content-box">
                    {
                        this.state.showRes ? <div className="res-box">
                                                {
                                                    this.state.res.length !== 0?(
                                                        <div>
                                                            <span className="res-total-header flex-between">
                                                                <p>共{this.state.res.length}条</p>
                                                                <p>总支出：{getTotal(this.state.res)}</p>
                                                            </span>
                                                            <ul className="res-item-wrap" ref="list">
                                                                {
                                                                    this.state.res.map((block, index) => (
                                                                        <li className="res-item" key={index}>
                                                                            <div className="header-p"></div>
                                                                            <div className="res-item__header">{dateFormat(block.date)}</div>
                                                                            <ul className="res-item__list">
                                                                                {
                                                                                    block.list.map((item, j) => <li id={item.id} key={j} className="res-item__body flex-between" onClick={this.goItemDetail}>
                                                                                        <label className="flex-center">
                                                                                            <i className={`tag-icon fa fa-${item.item.tag.icon}`} style={{color: `#${item.item.tag.color}`}} aria-hidden="true"/>
                                                                                            <span>
                                                                                        <p className="type-name">{item.item.tag.tagName}</p>
                                                                                        <p className="bak">{item.item.bak}</p>
                                                                                    </span>
                                                                                        </label>
                                                                                        <h3 className={`${item.item.isExpense?'':'is-expense'}`}>{parseFloat(item.item.payNum).toFixed(2)}</h3>
                                                                                    </li>)
                                                                                }
                                                                            </ul>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    ):<p className="nores">没找到哦，换个关键词试试吧</p>
                                                }
                                            </div>:(<div className="search-tag-box">
                                                        <span className="tag-button" value="月份" onClick={this.tagSearch}>月份</span>
                                                        <span className="tag-button" value="好" onClick={this.tagSearch}>好</span>
                                                        <span className="tag-button" value="午餐" onClick={this.tagSearch}>午餐</span>
                                                        <span className="tag-button" value="水果" onClick={this.tagSearch}>水果</span>
                                                        <span className="tag-button" value="早餐" onClick={this.tagSearch}>早餐</span>
                                                        <span className="tag-button" value="晚餐" onClick={this.tagSearch}>晚餐</span>
                                                    </div>)
                    }
                </div>

            </section>
        )
    }
}

SearchAccount.contextTypes = {
    router: PropTypes.object.isRequired
}

export default SearchAccount