import React from 'react';
import ReactDOM from 'react-dom';

// Store
import { Provider } from 'react-redux';
import store from './store/store';

// Pages
import App from './pages/App';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);