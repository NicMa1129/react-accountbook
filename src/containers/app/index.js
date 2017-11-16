import React, { Component } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
class App extends Component {

    constructor(){
        super()
        this.onEnter = this.onEnter.bind(this)
        this.onEntering = this.onEntering.bind(this)
        this.onEntered = this.onEntered.bind(this)
        this.onExit = this.onExit.bind(this)
        this.onExiting = this.onExiting.bind(this)
        this.onExited = this.onExited.bind(this)
    }
  componentWillMount(){

  }

  componentDidMount(){

  }

    onEnter(node){
        // console.log(node)
        console.log("onEnter")
    }
    onEntering(node){
        // console.log(node)
        console.log("onEntering")
    }
    onEntered(node){
        // console.log(node)
        console.log("onEntered")
    }
    onExit(node){
        // console.log(node)
        console.log("onExit")
    }
    onExiting(node){
        // console.log(node)
        console.log("onExiting")
    }
    onExited(node){
        // console.log(node)
        console.log("onExited")
    }
  render() {
      const Fade = ({ children, ...props }) => (
            <CSSTransition
                {...props}
                timeout={700}
                classNames="fade"
                onEnter={this.onEnter}
                onEntering={this.onEntering}
                onEntered={this.onEntered}>
                {children}
            </CSSTransition>
        );

      return (
          <div className="app-container">
              <TransitionGroup>
                  <Fade key={this.props.location.pathname}>
                      {this.props.default}
                  </Fade>
              </TransitionGroup>
          </div>
      )
  }
}

export default App