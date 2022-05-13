import React, { useState, useEffect } from 'react'
import classNames from 'classnames';
import { Link, Redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import styles from './Home.module.scss';
import { setAuthentication, setProfile, setStatus } from '../../redux/slices/userSlice';
import { getUserFromStore, removeUserFromStore, storeUser } from '../../Factory';

const Home = () => {
  // const [ userInfo, setUserInfo ] = useState({})
  const [ scrolling, isScrolling ] = useState( false )

  const { isAuthenticated, userInfo } = useSelector((store) => store.user);;

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const scroll = () => {
    if ( window.scrollY > 15 ) {
      isScrolling( true );
    }
    else {
      isScrolling( false );
    }
  };

  useEffect( () => {
    window.addEventListener( 'scroll', scroll );
    return () => {
      window.removeEventListener( 'scroll', scroll );
    };
  }, [] );

  useEffect(() => {
    const userDetails = getUserFromStore( userInfo )

    if ( (isAuthenticated !== true || userInfo === null) && !userDetails ) {
      navigate('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const userDetails = getUserFromStore( userInfo )

    console.log(userDetails, !!userDetails, userDetails?.username === userInfo?.username, userInfo)

    if ( !!userDetails ) {
      dispatch( setProfile( userDetails ) )
      dispatch( setAuthentication( true ) )
      dispatch( setStatus( 'active' ) )
    } else {
      navigate('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logout = () => {
    removeUserFromStore( userInfo )
    dispatch( setProfile( null ) )
    dispatch( setAuthentication( null ) )
    dispatch( setStatus( null) )
    navigate('/login')
  }

  return (
    <div className={ styles.home }>
      <div className={ classNames( styles.bar, {
        [ styles.scroll ]: scrolling
      } ) }>
        <div className={ styles.salute }>
          <p>welcome {userInfo?.username ?? ''}</p>
        </div>

        <div className={ styles.entity }>
          <span className={ styles.icon }>{userInfo?.username?.charAt(0) ?? 'U'}</span>
          <span 
            className={ styles.logout }
            onClick={ logout }
          >Logout</span>
        </div>
      </div>
    </div>
  )
}

export default Home