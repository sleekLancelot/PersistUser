import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import styles from './Login.module.scss';
import { Link, Redirect } from 'react-router-dom';
import { setAuthentication, setProfile, setStatus } from '../../redux/slices/userSlice';
import { composeUserDetails, generateRandomID, sessionString, storeUser } from '../../Factory';

const Login = () => {
    const [ username, setUsername ] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()  

    const onChange = (e) => setUsername(e.target.value.toLowerCase())
    const login = () => {
        const newUser = composeUserDetails(username)
        storeUser( newUser )
        sessionStorage.setItem( sessionString, JSON.stringify( newUser ) )
        // console.log(composeUserDetails(username))
        dispatch( setProfile( newUser ) )
        dispatch( setAuthentication( true ) )
        dispatch( setStatus( 'active' ) )
        navigate('/')
    }

  return (
    <div className={ styles.login }>
        <div className={ styles.formBox }>
            <h3>Enter a username to login</h3>
            <div className={ styles.formWrap }>
                <div className={ styles.formRow }>
                    <label htmlFor='username'>
                        <i className="fas fa-user"></i>
                    </label>
                    <input
                        type='text'
                        name='username'
                        id='username'
                        placeholder='username'
                        required
                        value={ username }
                        onChange={ onChange }
                    />
                </div>
            </div>
            <button
                className={ styles.submit }
                disabled={ !username }
                onClick={ login }
            >
                Login
            </button>
        </div>
    </div>
  )
}

export default Login