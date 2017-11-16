import React from 'react'
import Icon from 'antd-mobile/lib/icon'
import 'antd-mobile/lib/icon/style/css'

const CloseHeader = ({close}) => (
    <header className="close-header flex-center">
        <Icon type="cross" className="close" onClick={close}/>
    </header>
)

export default CloseHeader