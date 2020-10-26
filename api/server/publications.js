import Sensors from "/imports/api/sensors.js";
import Events from "/imports/api/events.js";

import { ReactiveAggregate } from "meteor/tunguska:reactive-aggregate";

Meteor.publish("sensors", function() {
  return Sensors.find({ activo: true });
});

Meteor.publish("sensorsOne", function(ids) {
  return Sensors.find({ sensorid: ids, activo: true });
});
Meteor.publish("events", function() {
  return Events.find();
  //return Events.find();
});
Meteor.publish("eventsOne", function(sensorname) {
  return Events.find({ topic: sensorname });
  //return Events.find();
});
