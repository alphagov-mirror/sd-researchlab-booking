// test the Apollo query on our components
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';

import { GET_RESEARCH_LABS } from '../queries';
import LabList from '../components/lab/LabList';

const calendarMock = [
  {
    request: {
      query: GET_RESEARCH_LABS
    },
    result: {
      data: {
        success: true,
        calendars: {
          resourceId: '123456783',
          resourceName: 'bookingcalendar@testing.com',
          resourceEmail: 'whatever-i-am@whatever.com',
          capacity: 14,
          floorName: '6th',
          building: {
            buildingName: 'Trump Towers'
          }
        }
      }
    }
  }
];

describe('React Apollo Query component tests', () => {
  describe('The LabList component', () => {
    it('renders without error', () => {
      renderer.create(
        <MockedProvider mocks={calendarMock} addTypename={false}>
          <LabList />
        </MockedProvider>
      );
    });
  });
});
