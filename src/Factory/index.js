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

export const removeUserFromStore = ( userInfo ) => {
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

console.log(getKeyFromStore()?.length)