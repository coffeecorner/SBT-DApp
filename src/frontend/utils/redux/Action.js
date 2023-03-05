const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

export const login = (account, networkId) => ({
    type: LOGIN,
    payload: { account, networkId },
  });
  
export const logout = () => ({
    type: LOGOUT,
});