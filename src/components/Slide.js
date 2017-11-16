import React, { Component } from 'react'

class Slide extends Component {
    constructor(props){
        super(props)
        this.defaults = {
            container: "#" + (this.props.id || "slide-container"),
            next: this.props.next || function(){}
        }
        this.start = 0
        this.end = 0
        this.length = 0
        this.isLock = false//是否锁定整个操作
        this.isCanDo = false//是否移动滑块
        this.isTouchPad = (/hp-tablet/gi).test(navigator.appVersion)
        this.hasTouch = 'ontouchstart' in window && !this.isTouchPad
        this.touchStart = this.touchStart.bind(this)
        this.touchMove = this.touchMove.bind(this)
        this.touchEnd = this.touchEnd.bind(this)
        this.back = this.back.bind(this)
    }

    init(){
        if(this.pullLoading !== null){
            this.translate(0-this.pullOffset);
        }
        if(this.pushLoading !== null){
            this.translate(this.pushOffset);
        }
        this.addEvent(this.obj,'touchstart',this.touchStart);
        this.addEvent(this.obj,'touchmove',this.touchMove);
        this.addEvent(this.obj,'touchend',this.touchEnd);
        this.addEvent(this.obj,'mousedown',this.touchStart)
        this.addEvent(this.obj,'mousemove',this.touchMove)
        this.addEvent(this.obj,'mouseup',this.touchEnd)
    }

    translate(diff){//移动容器
        this.obj.style.webkitTransform='translate3d(0,'+diff+'px,0)';
        this.obj.style.transform='translate3d(0,'+diff+'px,0)';
    }

    setTransition(time){//设置效果时间
        this.obj.style.webkitTransition='all '+time+'s';
        this.obj.style.transition='all '+time+'s';
    }

    back(){//返回到初始位置
        if(this.pullLoading !== null) this.translate(0 - this.pullOffset);
        if(this.pushLoading !== null) this.translate(this.pushOffset);
        //标识操作完成
        this.isLock = false;
    }

    addEvent(element,event_name,event_fn){
        if (element.addEventListener) {
            element.addEventListener(event_name, event_fn, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event_name, event_fn);
        } else {
            element['on' + event_name] = event_fn;
        }
    }

    touchStart(e){
        if (this.objparent.scrollTop <= 0 && !this.isLock) {
            var even = typeof event == "undefined" ? e : event;
            //标识操作进行中
            this.isLock = true;
            this.isCanDo = true;
            //保存当前鼠标Y坐标
            this.start = this.hasTouch ? even.touches[0].pageY : even.pageY;

            //消除滑块动画时间
            this.setTransition(0);
            if(this.pullLoading !== null) this.pullLoading.innerHTML='下拉刷新数据'
            if(this.pushLoading !== null) this.pushLoading.innerHTML='上拉刷新数据'
        }
        return false;
    }

    touchMove(e){
        if (this.objparent.scrollTop <= 0 && this.isCanDo) {
            var even = typeof event == "undefined" ? e : event;
            //保存当前鼠标Y坐标
            this.end = this.hasTouch ? even.touches[0].pageY : even.pageY;

            even.preventDefault();
            //消除滑块动画时间
            this.setTransition(0);
            if (this.start < this.end) {
                //移动滑块
                if((this.end-this.start-this.pullOffset)/2<=150) {
                    this.length=(this.end - this.start - this.pullOffset);
                    this.translate(this.length);
                }
                else {
                    this.length+=0.3;
                    this.translate(this.length);
                }
            }
            // if(this.start > this.end){
            //     //移动滑块
            //     if((this.start - this.end-this.pushOffset)/2<=150) {
            //         this.length=(this.end - this.start - this.pushOffset);
            //         this.translate(this.length);
            //     }
            //     else {
            //         this.length-=0.3;
            //         this.translate(this.length);
            //     }
            // }
        }
    }

    touchEnd(e){
        if (this.isCanDo) {
            this.isCanDo = false;
            //判断滑动距离是否大于等于指定值
            if (this.end - this.start >= this.pullOffset) {
                //设置滑块回弹时间
                this.setTransition(0.5);
                //保留提示部分
                this.translate(0);
                //执行回调函数
                if(this.pullLoading !== null) this.pullLoading.innerHTML='正在刷新数据'
                if(this.pushLoading !== null) this.pushLoading.innerHTML='正在刷新数据'
                if (typeof this.defaults.next == "function") {
                    this.defaults.next(this);
                }
            }else {
                //返回初始状态
                this.back();
            }
        // else if(this.start - this.end >= this.pushOffset){
        //         //设置滑块回弹时间
        //         this.setTransition(0.5);
        //         //保留提示部分
        //         this.translate(0);
        //         //执行回调函数
        //         if(this.pullLoading !== null) this.pullLoading.innerHTML='正在刷新数据'
        //         if(this.pushLoading !== null) this.pushLoading.innerHTML='正在刷新数据'
        //         if (typeof this.defaults.next == "function") {
        //             this.defaults.next(this);
        //         }
        //     }
        }
    }

    componentDidMount(){
        let { pullLoading, pushLoading } = this.props
        this.obj = document.querySelector(this.defaults.container)

        this.pullLoading = pullLoading ? this.obj.firstElementChild : null
        this.pullOffset = pullLoading ? this.pullLoading.clientHeight : 0

        this.pushLoading = pushLoading ? this.obj.lastElementChild : null
        this.pushOffset = pushLoading ? this.pushLoading.clientHeight : 0
        if(pushLoading){
            this.obj.parentElement.style.transform = `translateY(-${this.pushOffset}px)`
        }
        this.objparent = this.obj.parentElement
        this.init()
    }

    render(){
        return (
            <div className="slide-outer">
                <div className="slide-container" id={this.props.id ? this.props.id: "slide-container"}>
                    {this.props.pullLoading ? <div className="loading">
                        下拉刷新数据
                    </div>:""}
                    {this.props.children}
                    {this.props.pushLoading ? <div className="loading">
                        上拉刷新数据
                    </div>:""}
                </div>
            </div>
        )
    }
}

export default Slide