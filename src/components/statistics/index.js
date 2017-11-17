import React from 'react'
import BackHeader from 'components/BackHeader'
import HighCharts from 'highcharts'
import { unique } from 'common/base'
require('./index.scss')

const getStatis = (list, year, month) => {
    let allCost = []
    let allTagName = []

    for(let i = 0; i < list.length; i++){
        let curYear = new Date(list[i].header.date).getFullYear()
        let curMonth = new Date(list[i].header.date).getMonth()
        if(curYear === year && curMonth === month){
            list[i].payList.forEach(item => {
                allTagName.push(item.tag.tagName)
                allCost.push(item)
            })
        }
    }

    let tagNameArr = unique(allTagName)
    let total = {}
    tagNameArr.forEach(name => {
        allCost.forEach(item => {
            if(name === item.tag.tagName){
                total[name] = {
                    cost: parseFloat(total[name]?total[name].cost:0) + parseFloat(item.payNum),
                    tag: item.tag
                }
            }
        })
    })
    return total
}

let option = {
    chart: {
        type: 'pie'
    },
    title: {
        text: null
    },
    credits:{
        enabled: false // 禁用版权信息
    },
    series: [{
        innerSize: '40%',
        data: []
    }]
}

class Statistics extends React.Component {
    constructor(){
        super()
        this.state = {
            year: "",
            month: ""
        }
        this.initData = this.initData.bind(this)
        this.lastMonth = this.lastMonth.bind(this)
        this.nextMonth = this.nextMonth.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState){
        let { accountList } = nextProps
        this.initData(accountList, nextState.year, nextState.month)
        this.chart.update(option)
        return true
    }

    componentWillMount(){
        let { accountList } = this.props
        let year = new Date(accountList.list[0].header.date).getFullYear()
        let month = new Date(accountList.list[0].header.date).getMonth()
        this.initData(accountList, year, month)
        this.setState({
            year: year,
            month: month
        })
    }

    componentDidMount(){
        let el = document.querySelector("#chart")
        el.style.height = el.offsetWidth + "px"

        this.chart = HighCharts.chart('chart', option)
    }

    initData(accountList, year, month){
        let total = getStatis(accountList.list, year, month)
        let chartData = []
        let totalCostArr = Object.values(total)
        let chartDataItem = Object.entries(total)
        let totalCost = 0
        let percent
        totalCostArr.forEach(v => {
            totalCost = totalCost + parseFloat(v.cost)
        })

        chartDataItem.forEach(item => {
            percent = (parseFloat(item[1].cost) / totalCost) * 100
            item.push(parseInt(percent))
            chartData.push({
                name: item[0],
                y: item[2],
                dataLabels: {
                    enabled: false
                },
                color: '#' + item[1].tag.color
            })
        })

        this.data = chartDataItem
        this.totalCost = totalCost
        this.chartData = chartData.slice()
        option.series[0].data = this.chartData
        console.log(this.chartData)

    }

    lastMonth(){
        let year, month
        if(this.state.month === 1){
            year = this.state.year - 1
            month = 11
        }else{
            year = this.state.year
            month = this.state.month - 1
        }

        this.setState({
            year: year,
            month: month
        })
    }

    nextMonth(){
        let year, month
        if(this.state.month === 12){
            year = this.state.year + 1
            month = 0
        }else{
            year = this.state.year
            month = this.state.month + 1
        }
        this.setState({
            year: year,
            month: month
        })
    }

    render(){
        return (
            <section className="container-wrapper statistics-container">
                <BackHeader>
                    <i className="fa fa-bar-chart" aria-hidden="true"/>
                </BackHeader>
                <div className="month-select-panel flex-center">
                    <i className="fa fa-angle-left" aria-hidden="true" onClick={this.lastMonth} />
                    <span>
                        <p>{this.state.month + 1}-01</p>
                        <label>至</label>
                        <p>{this.state.month + 1}-30</p>
                    </span>
                    <i className="fa fa-angle-right" aria-hidden="true" onClick={this.nextMonth} />
                </div>
                <div className="char-box">
                    <div id="chart"></div>
                    <div className="total-label">
                        <label>{this.totalCost}</label>
                        <p>总支出</p>
                    </div>
                </div>
                <div className="charts-label-list">
                    <ul>
                        {
                            this.chartData.length !== 0 ? this.chartData.map((item, i) => <li key={i} className="charts-label-list__item flex-between">
                                <span className="tagName-icon">
                                    <i className={`fa fa-${this.data[i][1].tag.icon}`} aria-hidden="true" style={{color: `#${this.data[i][1].tag.color}`}}/>
                                    <span>{item.name}</span>
                                </span>
                                <span>{item.y}%</span>
                                <label>{this.data[i][1].cost}</label>
                            </li>):""
                        }
                    </ul>
                </div>
            </section>
        )
    }
}

export default Statistics