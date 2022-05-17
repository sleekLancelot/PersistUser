import React, { useState, useEffect } from 'react'
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import styles from './Home.module.scss';
import { 
  setAuthentication, 
  setProfile, 
  setStatus 
} from '../../redux/slices/userSlice';
import { 
  background, 
  foreground,
  getKeyFromStore, 
  getLastLoggedInUser, 
  getUserFromStore, 
  ifSessionExistInDB, 
  preceding, 
  removeUserFromStore, 
  sessionString, 
} from '../../Factory';
import Session from '../../Components/User/Session';

const Home = () => {
  const [ scrolling, isScrolling ] = useState( false )
  const [ focus, setFocus] = useState('visible')
  const [ sessions, setSessions ] = useState( null );

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

  const auth = () => {
    dispatch( setAuthentication( true ) )
    dispatch( setStatus( 'active' ) )
  }

  /**
   * @description what this does is persist the currently signed in user, and if they are signed out it fetches the last user that logs in,else it navigates to the login page
   */
  useEffect(() => {
    const isLoggedIN = JSON.parse(sessionStorage.getItem( `${sessionString}` ))

    if ( !!isLoggedIN && !!ifSessionExistInDB( isLoggedIN ) ) {
      dispatch( setProfile( isLoggedIN ) )
      auth()
    } else if ( !!getKeyFromStore()?.length ) {
      dispatch( setProfile( getLastLoggedInUser() ) )
      sessionStorage.setItem( sessionString, JSON.stringify( getLastLoggedInUser() ) )
      auth()
    } else {
      dispatch( setAuthentication( null ) )
      dispatch( setStatus( null) )
      navigate('/login')
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

   /**
   * @description what this does is set the presence status of all signed in user
   */
  useEffect(() => {
    const isLoggedIN = JSON.parse(sessionStorage.getItem( `${sessionString}` ))

    const setPresence = () => {
      setFocus( document.visibilityState )
    }

    
    if ( !!ifSessionExistInDB( isLoggedIN ) ) {
      document.addEventListener("visibilitychange", setPresence)
      if ( focus === 'visible' ) {
        foreground( isLoggedIN, focus )
      } else {
        background( isLoggedIN )
      }
    }

    return () => {
      document.removeEventListener("visibilitychange", setPresence)
    }
  }, [focus])


   /**
   * @description what this does is to get the list of other sessions with the same username
   */
  useEffect( () => {
    // const isLoggedIN = JSON.parse(sessionStorage.getItem( `${sessionString}` ))

    if ( userInfo !== null ) {
      const allSessionsForThisUser = getUserFromStore(`${preceding}${userInfo?.username}`)

       if ( !!allSessionsForThisUser?.length ) {
         console.log(allSessionsForThisUser)
        setSessions( () => allSessionsForThisUser?.filter( session => session.sessionID !== userInfo.sessionID ) );         
       }
    }

    const register = (e) => {
      if ( userInfo !== null ) {
        const allSessionsForThisUser = getUserFromStore(`${preceding}${userInfo?.username}`)

        if ( !!allSessionsForThisUser?.length ) {

          console.log(allSessionsForThisUser)
          setSessions( () => allSessionsForThisUser?.filter( session => session.sessionID !== userInfo.sessionID ) )
        }

        // if ( e.key === preceding + userInfo?.username ) {
        //   console.log( JSON.parse(e) )
        // }
      }
    }

    window.addEventListener('storage', register)

    return () => {
      window.removeEventListener('storage', register)
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo])

  console.log(sessions)

  const logout = () => {
    removeUserFromStore( userInfo )
    dispatch( setProfile( null ) )
    dispatch( setAuthentication( null ) )
    dispatch( setStatus( null) )
    navigate('/login')
  }

  return isAuthenticated && (
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

          <span 
            className={ styles.signIn }
            onClick={ () => navigate('/login') }
          >Sign In</span>
        </div>
      </div>

      <div className={ styles.content }>
        {
          !!sessions?.length &&
          sessions.map( (eachSession, index) => (
            <Session
              key={index}
              userInfo={eachSession}
              callback={ () => setSessions( (session) => session.filter( session => session.sessionID !== eachSession.sessionID ))}
            />
          ))
        }
      </div>
    </div>
  )
}

export default Home