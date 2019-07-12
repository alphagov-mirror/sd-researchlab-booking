import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import '../css/layout.scss';

import { initAll } from 'govuk-frontend';

import Footer from '../components/navigation/Footer';
import Header from '../components/navigation/Header';
import Proto from '../components/banners/proto';
import Landing from './Landing';

import Labs from './Labs';
import LabBooking from './LabBooking';
import BookingFormName from '../components/booking/BookingFormName';
import BookingFormDate from '../components/booking/BookingFormDate';
import BookingFormDetails from '../components/booking/BookingFormDetails';

const bookingFormRoutes = [
  {
    path: '/book-a-research-lab',
    component: LabBooking,
    routes: [
      { path: '/book-a-research-lab/booking-date', component: BookingFormDate }
    ]
  }
];

const RouteWithSubRoutes = (route) => {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
};

const Layout = () => {
  initAll();
  return (
    <Router>
      <div className="govuk-template__body govuk-rlab_body">
        <Header />
        <div className="govuk-width-container">
          <Proto />
          <main className="govuk-main-wrapper " id="main-content" role="main">
            <Switch>
              <Route path="/" exact component={Landing} />
              <Route path="/gds-research-labs" component={Labs} />
              <Route path="/book-a-research-lab" exact component={LabBooking} />

              <Route
                path="/book-a-research-lab/booking-name"
                component={BookingFormName}
              />

              <Redirect to="/" />
            </Switch>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default Layout;
