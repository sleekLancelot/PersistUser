import React, { useState } from 'react'

import classNames from 'classnames';

import styles from './Session.module.scss'
import { removeUserFromStore } from '../../Factory';

const Session = ({
    userInfo,
    callback,
}) => {
    const [ inSession, setInSession ] = useState( true )

    console.log(userInfo)

  return (
    <div className={ styles.session}>
        <span className={ classNames( styles.icon, {
            [ styles.idle ]: userInfo?.status === 'idle',
            [ styles.active ]: userInfo?.status === 'active',
        } )}
        >{userInfo?.username?.charAt(0) ?? 'U'}</span>
        <div className={ styles.nameAndStatus}>
            <span>{userInfo?.username}</span>
            <small>{userInfo?.status}</small>
        </div>
        <button 
            className={ classNames( styles.sessionLogout, {
                [ styles.logout ]: !inSession
            }) }
            onClick={ () => {
                setInSession( false )
                callback()
                removeUserFromStore( userInfo, true )
            } }
        >
            logout
        </button>
    </div>
  )
}

export default Session