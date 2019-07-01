import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

// import withSession from './components/withSession';
import Landing from './pages/Landing';
// import Register from './components/auth/Register';
import RegisterConfirm from './components/auth/RegisterConfirm';
import RegisterLink from './components/auth/RegisterLink';
import Login2FA from './components/auth/Login2FA';

import Researchlabs from './pages/ResearchLabs';

const Root = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Landing} />
      {/* <Route
          path="/register"
          exact
          render={() => <Register refetch={refetch} />}
        /> */}
      <Route path="/register/confirm/:_id" component={RegisterConfirm} />
      <Route path="/register/verify" component={RegisterLink} />
      <Route path="/login/2fa/:id" component={Login2FA} />
      <Route path="/research-labs" component={Researchlabs} />
      <Redirect to="/" />
    </Switch>
  </Router>
);

const Routes = Root;

export default Routes;
