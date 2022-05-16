export const preceding = 'simple-user-'
export const sessionString = 'simple_loggedIN'

export const getPresentTime = () => {

}

export const generateRandomID = ( username, depth = 8 ) => {
    let sessionID = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < depth; i++)
  sessionID += possible.charAt(Math.floor(Math.random() * possible.length));

  return username.concat(';', sessionID)
}

export const composeUserDetails = ( username ) => (
    {
        username,
        sessionID: generateRandomID( username ),
        loggedInAt: Date.now(),
        status: 'active',
    }
)

export const storeUser = ( userInfo ) => {
    let alreadyExist = getUserFromStore(`${preceding}${userInfo?.username}`)

    if ( !!alreadyExist ) {
        if ( Array.isArray(alreadyExist)) {
            localStorage.setItem(`${preceding}${userInfo?.username}`, JSON.stringify( [ ...alreadyExist, userInfo ] ))
        } else {
            localStorage.setItem(`${preceding}${userInfo?.username}`, JSON.stringify( [ alreadyExist, userInfo ] ))            
        }
    } else {
        localStorage.setItem(`${preceding}${userInfo?.username}`, JSON.stringify( userInfo ))
    }
}

export const removeUserFromStore = ( userInfo, letSessionBe = false, callback ) => {
    getKeyFromStore(preceding).map( key => {
        if ( key === `${preceding}${userInfo?.username}`) {

        let storedValue = getUserFromStore(key)
        // console.log(storedValue)

        if ( Array.isArray(storedValue) ) {
                // console.log(storedValue, 'Array')
            let newValues = storedValue.filter( stored => stored.sessionID !== userInfo?.sessionID )
                // console.log(newValues, key)
            localStorage.setItem( key , JSON.stringify( newValues ))

        } else {
                // console.log(storedValue, key)
            localStorage.removeItem( key )
        }

    }
    })

    // if ( letSessionBe ) {
    //     callback()
    // } else {
    //     sessionStorage.removeItem( `${sessionString}` )        
    // }

    sessionStorage.removeItem( `${sessionString}` )
}

export const getUserFromStore = ( username ) => {
    return JSON.parse(localStorage.getItem(`${username}`));
}

export const getKeyFromStore = ( pre = preceding ) => {
    return Object.keys(localStorage).filter( value => value.substring( 0, pre.length) === pre )
}

export const getLastLoggedInUser = () => {
    let allStoredUser = getKeyFromStore(preceding).flatMap( key => {
        let storedValue = getUserFromStore(key)
        return storedValue
    })

    return allStoredUser.reduce((ding, dong) => (ding.loggedInAt > dong.loggedInAt) ? ding : dong)

}

let timer = null,
    idleTime = 60000

export const foreground = ( userInfo, focus ) => {
    if ( timer !== null) {
        clearTimeout( timer )
        timer = null
    }

    let thisUser = getUserFromStore( `${preceding}${userInfo?.username}` )

    if ( Array.isArray(thisUser) ) {

        // let index = thisUser?.findIndex( user => user.sessionID === userInfo.sessionID )

        let thisParticularSession = thisUser?.find( user => user.sessionID === userInfo.sessionID )

        // if ( thisUser[index]?.status !== 'active') {
        if ( thisParticularSession?.status !== 'active') {
            // let newObj = {
            //     ...thisUser[index],
            //     status: 'active',
            // }

            let newObj = {
                ...thisParticularSession,
                status: 'active',
            }

            // thisUser[index] = newObj

            thisUser = thisUser.map( user => user.sessionID === newObj.sessionID ? newObj : user )

            // console.log(thisUser, newObj)

            localStorage.setItem(`${preceding}${userInfo?.username}`, JSON.stringify( thisUser ))
            // sessionStorage.setItem( sessionString, JSON.stringify( thisUser[index] ) )
            sessionStorage.setItem( sessionString, JSON.stringify( newObj ) )
        }
   
    } else if ( thisUser?.sessionID === userInfo?.sessionID ) {
        if ( thisUser?.status !== 'active' ) {
            thisUser = {
                ...thisUser,
                status: 'active',
            }

            // console.log(thisUser)
        
            localStorage.setItem(`${preceding}${userInfo?.username}`, JSON.stringify( thisUser ))
            sessionStorage.setItem( sessionString, JSON.stringify( thisUser ) )
    
            // console.log(thisUser)
        }
    }

    // console.log(thisUser)
}

export const background = ( userInfo ) => {
    let thisUser = getUserFromStore( `${preceding}${userInfo?.username}` )

    if ( Array.isArray(thisUser) ) {

        let index = thisUser?.findIndex( user => user.sessionID === userInfo.sessionID )

        if ( thisUser[index]?.status !== 'inactive') {
            let newObj = {
                ...thisUser[index],
                status: 'inactive',
            }

            thisUser[index] = newObj

            // console.log(thisUser, newObj)

            timer = setTimeout( () => {
                localStorage.setItem(`${preceding}${userInfo?.username}`, JSON.stringify( thisUser ))
                sessionStorage.setItem( sessionString, JSON.stringify( thisUser[index] ) )
            }, idleTime)

            // timer()

        }

        
    } else if ( thisUser?.sessionID === userInfo?.sessionID ) {
        if ( thisUser?.status !== 'inactive' ) {
            thisUser = {
                ...thisUser,
                status: 'inactive',
            }
    
            timer = setTimeout( () => {
                localStorage.setItem(`${preceding}${userInfo?.username}`, JSON.stringify( thisUser ))
                sessionStorage.setItem( sessionString, JSON.stringify( thisUser ) )
            }, idleTime)

            // timer()
    
            // console.log(thisUser)
        }
    }

    // console.log(thisUser)

}