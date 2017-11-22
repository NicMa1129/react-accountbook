import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BackHeader from 'components/BackHeader'
import { dateTimeFormat } from 'common/base'
import Modal from 'antd-mobile/lib/modal'
import 'antd-mobile/lib/modal/style/css'
require('./index.scss')

class Detail extends Component {
    constructor(){
        super()
        this.state = {
            blockIndex: null,
            itemIndex: null,
            accountList: []
        }
        this.delAccount = this.delAccount.bind(this)
    }

    componentWillMount(){
        let { params, accountList } = this.props
        let { id } = params
        let blockIndex = id.split('_')[0]
        let itemIndex = id.split('_')[1]
        this.setState({
            accountList: accountList,
            blockIndex: blockIndex,
            itemIndex: itemIndex
            // detailItem: accountList.list[blockIndex].payList[itemIndex]
        })
    }

    componentWillReceiveProps(nextProps){

    }

    delAccount(){
        let { delAccount } = this.props
        delAccount({
            blockIndex: this.state.blockIndex,
            itemIndex: this.state.itemIndex
        })
        this.context.router.push('/accountbook')
    }

    render(){
        const block = this.state.itemIndex !== null ? this.state.accountList.list[this.state.blockIndex] : null

        const alert = Modal.alert
        return (
            <section className="container-wrapper detail-container">
                <BackHeader>
                    <h3 className="center-title">明细</h3>
                </BackHeader>
                <div className="detail-list">
                    <div className="detail-item flex-between">
                        <p className="item-label">记账金额</p>
                        <label className="item-value">{block !== null?block.payList[this.state.itemIndex].payNum:''}</label>
                    </div>
                    <div className="detail-item flex-between">
                        <p className="item-label">分类</p>
                        <p className="item-value">{block !== null?block.payList[this.state.itemIndex].isExpense?'支出':'收入':''}>{block !== null?block.payList[this.state.itemIndex].tag.tagName:''}</p>
                    </div>
                    <div className="detail-item flex-between">
                        <p className="item-label">账户</p>
                        <p className="item-value">现金</p>
                    </div>
                    <div className="detail-item flex-between">
                        <p className="item-label">记录人</p>
                        <p className="item-value">我</p>
                    </div>
                    <div className="detail-item flex-between">
                        <p className="item-label">记账时间</p>
                        <p className="item-value">{block !== null?dateTimeFormat(block.header.date):''}</p>
                    </div>
                </div>
                <div className="bak-box">
                    <p>备注</p>
                    <p className="bak-text">{block !== null?block.payList[this.state.itemIndex].bak !== ""?block.payList[this.state.itemIndex].bak:"未填写":''}</p>
                </div>
                <div className="operation-box">
                    <button className="button edit" onClick={() => {this.context.router.push('/typeIn/' + this.state.blockIndex + "/" + this.state.itemIndex)}}>编辑</button>
                    <button className="button del" onClick={() => {
                        alert('确定要删除吗？','辛苦记得账就找不回来啦！',[
                            {text: '取消', onPress: () => {}},
                            {text: '确定', onPress: this.delAccount},
                        ])
                    }}>删除</button>
                </div>
            </section>
        )
    }
}

Detail.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Detail