const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

export const login = (account, networkId) => ({
    type: LOGIN,
    payload: { account, networkId },
  });
  
export const logout = () => ({
    type: LOGOUT,
});

export const setProvider = (provider) => {
    return {
      type: 'SET_PROVIDER',
      payload: provider
    }
  }
  
  // Set Signer
  export const setSigner = (signer) => {
    return {
      type: 'SET_SIGNER',
      payload: signer
    }
  }