import React, { useState } from 'react'

import classNames from 'classnames';

import styles from './Session.module.scss'
import { removeUserFromStore } from '../../Factory';

const Session = ({
    userInfo,
    callback,
}) => {
    const [ inSession, setInSession ] = useState( true )

  return (
    <div className={ styles.session}>
        <span className={ styles.icon}>{userInfo?.username?.charAt(0) ?? 'U'}</span>
        <span>{userInfo?.username}</span>
        <button 
            className={ classNames( styles.sessionLogout, {
                [ styles.logout ]: !inSession
            }) }
            onClick={ () => {
                setInSession( false )
                callback( userInfo?.sessionID )
                removeUserFromStore( userInfo, true )
            } }
        >
            logout
        </button>
    </div>
  )
}

export default Session