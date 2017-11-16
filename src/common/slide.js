export default class Slide {
    constructor(props){
        this.defaults = {
            container: props.container || '',
            next: props.next || function(){}
        }
        this.start = 0
        this.end = 0
        this.length = 0
        this.isLock = false//是否锁定整个操作
        this.isCanDo = false//是否移动滑块
        this.isTouchPad = (/hp-tablet/gi).test(navigator.appVersion)
        this.hasTouch = 'ontouchstart' in window && !this.isTouchPad
        this.obj = document.querySelector(this.defaults.container)
        this.loading = this.obj.firstElementChild
        this.offset = this.loading.clientHeight
        this.objparent = this.obj.parentElement
        this.touchStart = this.touchStart.bind(this)
        this.touchMove = this.touchMove.bind(this)
        this.touchEnd = this.touchEnd.bind(this)
        this.back = this.back.bind(this)
        this.init()
    }

    init(){
        this.translate(0-this.offset);
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
        this.translate(0 - this.offset);
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
            this.loading.innerHTML='下拉刷新数据';
        }
        return false;
    }

    touchMove(e){
        if (this.objparent.scrollTop <= 0 && this.isCanDo) {
            var even = typeof event == "undefined" ? e : event;
            //保存当前鼠标Y坐标
            this.end = this.hasTouch ? even.touches[0].pageY : even.pageY;

            if (this.start < this.end) {
                even.preventDefault();
                //消除滑块动画时间
                this.setTransition(0);
                //移动滑块
                if((this.end-this.start-this.offset)/2<=150) {
                    this.length=(this.end - this.start - this.offset);
                    this.translate(this.length);
                }
                else {
                    this.length+=0.3;
                    this.translate(this.length);
                }
            }
        }
    }

    touchEnd(e){
        if (this.isCanDo) {
            this.isCanDo = false;
            //判断滑动距离是否大于等于指定值
            if (this.end - this.start >= this.offset) {
                //设置滑块回弹时间
                this.setTransition(0.5);
                //保留提示部分
                this.translate(0);
                //执行回调函数
                this.loading.innerHTML='正在刷新数据';
                if (typeof this.defaults.next == "function") {
                    this.defaults.next.call(this, e);
                }
            } else {
                //返回初始状态
                this.back();
            }
        }
    }
}