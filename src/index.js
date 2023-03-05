import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.css'
import App from './frontend/components/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import { legacy_createStore as createStore } from "redux";
import Reducer from "./frontend/utils/redux/Reducer";

const rootElement = document.getElementById("root");
const store = createStore(Reducer);

render( 
    <>
    <Provider store={store}>
        <App />
    </Provider>
    </>
, rootElement);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
