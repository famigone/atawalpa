import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
//import App from '/imports/ui/App'
import { Ruteador } from './routes';

Meteor.startup(() => {
  render(<Ruteador />, document.getElementById('react-target'));
});
