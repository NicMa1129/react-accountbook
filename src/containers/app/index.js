import React, { Component } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
class App extends Component {

    constructor(){
        super()
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