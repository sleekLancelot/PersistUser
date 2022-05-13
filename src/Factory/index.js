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
    localStorage.setItem(userInfo?.username, JSON.stringify( userInfo ))
}

export const removeUserFromStore = ( userInfo ) => {
    localStorage.removeItem( userInfo?.username )
}

export const getUserFromStore = ( userInfo ) => {
    return JSON.parse(localStorage.getItem(`${userInfo?.username}`));
}