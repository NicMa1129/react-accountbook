import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SearchBar from 'antd-mobile/lib/search-bar'
import 'antd-mobile/lib/search-bar/style/css'
import { dateFormat } from 'common/base'
require('./index.scss')

const getTotal = list => {
    let res = 0
    list.forEach(item => {
        res = res + parseFloat(item.item.payNum)
    })
    return res.toFixed(2)
}

class SearchAccount extends Component {
    constructor(){
        super()
        this.state = {
            showRes: false,
            res: []
        }
        this.goBack = this.goBack.bind(this)
        this.searchChange = this.searchChange.bind(this)
        this.search = this.search.bind(this)
    }

    componentWillMount(){

    }

    componentDidMount(){
        this.autoFocusInst.focus();
    }

    componentWillReceiveProps(nextProps){

    }

    goBack(){
        this.context.router.goBack()
    }

    searchChange(val){
        if(val !== ""){
            let res = this.search(val)
            this.setState({
                showRes: true,
                res: res
            })
        }

        if(val === "" && this.state.showRes === true){
            this.setState({
                showRes: false
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
                    res.push({
                        id: i +'_'+j,
                        date: block.header.date,
                        item: item
                    })
                }
            })
        })
        res = res.sort((a, b) => a.date > b.date)
        console.log(res)
        return res
    }

    render(){
        return (
            <section className="container-wrapper searchaccount-container">
                <SearchBar placeholder="类别/备注/金额"
                           ref={ref => this.autoFocusInst = ref}
                           onCancel={this.goBack}
                            onChange={this.searchChange}/>
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
                                                            <ul>
                                                                {
                                                                    this.state.res.map((item, index) => (
                                                                        <li className="res-item" key={index}>
                                                                            <div className="res-item__header">{dateFormat(item.date)}</div>
                                                                            <div id={item.id} className="res-item__body flex-between">
                                                                                <label className="flex-center">
                                                                                    <i className={`tag-icon fa fa-${item.item.tag.icon}`} style={{color: `#${item.item.tag.color}`}} aria-hidden="true"/>
                                                                                    <span>
                                                                                        <p className="type-name">{item.item.tag.tagName}</p>
                                                                                        <p className="bak">{item.item.bak}</p>
                                                                                    </span>
                                                                                </label>
                                                                                <h3 className={`${item.item.isExpense?'':'is-expense'}`}>{parseFloat(item.item.payNum).toFixed(2)}</h3>
                                                                            </div>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    ):<p className="nores">没找到哦，换个关键词试试吧</p>
                                                }
                                            </div>:(<div className="search-tag-box">
                                                        <span className="tag-button">月份</span>
                                                        <span className="tag-button">好</span>
                                                        <span className="tag-button">午餐</span>
                                                        <span className="tag-button">水果</span>
                                                        <span className="tag-button">月份</span>
                                                        <span className="tag-button">月份</span>
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