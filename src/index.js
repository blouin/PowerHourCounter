import React from 'react';
import ReactDOM from 'react-dom';

// Store
import { Provider } from 'react-redux';
import store from './store/store';

// Pages
import App from './pages/App';

ReactDOM.render(
    
        <Provider store={store}>
            <App />
        </Provider>
    ,
    document.getElementById('root')
);