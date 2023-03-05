const initialState = {
    loggedIn: false,
    account: null,
    networkId: null,
};

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

const Reducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN:
        return {
          loggedIn: true,
          account: action.payload.account,
          networkId: action.payload.networkId,
        };
      case LOGOUT:
        return initialState;
      default:
        return state;
    }
};

export default Reducer;