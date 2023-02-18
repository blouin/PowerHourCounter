import React from "react";
import { useSelector } from 'react-redux';
import { Router, Switch, Route } from "react-router-dom";
import { createHashHistory } from 'history';
import OrientationWarningSnackbar from './OrientationWarningSnackbar';
import ElectronUpdateSnackbar from './ElectronUpdateSnackbar';
import DefaultLanguageDialog from './DefaultLanguageDialog';

// Styles
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import brown from '@material-ui/core/colors/brown';
import grey from '@material-ui/core/colors/grey';

// Pages
import { default as Settings} from "./settings/App";
import { default as Play } from "./play/App";
import { default as History } from "./history/App";

const history = createHashHistory();

const _DEFAULT = () => {
    const theme = createTheme({
        palette: {
            primary: brown,
            secondary: grey,
            type: useSelector(s => s.ui.theme),
          }
    });

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
}

export default _DEFAULT;