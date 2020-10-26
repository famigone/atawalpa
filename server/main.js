import { Meteor } from "meteor/meteor";
import { LinksCollection } from "/imports/api/links";
import "../imports/api/events.js";

Meteor.startup(() => {
  let server = Meteor.settings.mqttHost;
  Events.mqttConnect(server, ["nivel/+"], { insert: true });
});
