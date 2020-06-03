import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { Router, Switch, Route } from "react-router-dom";
import { createHashHistory } from 'history';
import OrientationWarningSnackbar from './OrientationWarningSnackbar';
import ElectronUpdateSnackbar from './ElectronUpdateSnackbar';
import DefaultLanguageDialog from './DefaultLanguageDialog';

// Styles
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import brown from '@material-ui/core/colors/brown';
import grey from '@material-ui/core/colors/grey';

// Pages
import { default as Settings} from "./settings/App";
import { default as Play } from "./play/App";
import { default as History } from "./history/App";

// Analytics
import { initLog, logPageView } from '../utilities/analytics';

export default () => {
    const theme = createMuiTheme({
        palette: {
            primary: brown,
            secondary: grey,
            type: useSelector(s => s.ui.theme),
          }
    });

    const history = createHashHistory();
    history.listen(location => {
        if (window.FB) {
            const items = [].slice.call(document.getElementsByClassName('social-wrapper'));
            items.forEach((item) => window.FB.XFBML.parse(item));
        }
        logPageView(location.pathname);
    });
    
    // Google Analytics
    useEffect(() => {
        initLog();
        logPageView(window.location.pathname);
    }, []);

    // Facebook plugin
    const language = useSelector(s => s.ui.language);
    useEffect(() => {
        const fbLanguage = language === 'fr' ? 'fr_CA' : 'en_US';
        if (document && typeof document !== 'undefined') {
            ((d, s, id) => {
              const fjs = d.getElementsByTagName(s)[d.getElementsByTagName(s).length - 1];
              if (d.getElementById(id)) return;
              const js = d.createElement(s);
              js.id = id;
              js.src = `//connect.facebook.net/${fbLanguage}/sdk.js#xfbml=1&version=v7.0`;
              fjs.parentNode.insertBefore(js, fjs);
            })(document, 'script', 'facebook-jssdk');
          }
    }, [language]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ElectronUpdateSnackbar />
            <Router history={history}>
                <DefaultLanguageDialog />
                <OrientationWarningSnackbar />
                <Switch>
                    <Route path="/" exact>
                        <Play />
                    </Route>
                    <Route path="/settings">
                        <Settings />
                    </Route>
                    <Route path="/history">
                        <History />
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
};