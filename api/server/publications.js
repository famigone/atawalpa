import Sensors from "/imports/api/sensors.js";
import Tags from "/imports/api/tags.js";
import Events from "/imports/api/events.js";

Meteor.publish("sensors", function() {
  return Sensors.find({ activo: true });
});

Meteor.publish("tags", function() {
  return Tags.find({ activo: true });
});

Meteor.publish("sensorsOne", function(tagId) {
  return Sensors.find({ tagId: tagId, activo: true });
});

Meteor.publish("sensorsOneSensor", function(codigo) {
  return Sensors.find({ codigo: codigo, activo: true });
});
Meteor.publish("TagsOne", function(tag) {
  return Sensors.find({ tag: tag, activo: true });
});
Meteor.publish("TagsOneId", function(tagId) {
  return Tags.find({ _id: tagId, activo: true });
});
Meteor.publish("events", function() {
  return Events.find();
  //return Events.find();
});
Meteor.publish("eventsOne", function(sensorname) {
  return Events.find({ topic: sensorname });
  //return Events.find();
});
const MAX_telemetria = 100;
const MAX_mms = 1000;

Meteor.publish("eventsOneLimit", function(sensorname) {
  const options = {
    sort: { createdAt: -1 },
    limit: MAX_mms
  };

  return Events.find(
    {
      topic: sensorname
    },
    options
  );
});
