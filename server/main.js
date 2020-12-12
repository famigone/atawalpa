import { Meteor } from "meteor/meteor";
import { LinksCollection } from "/imports/api/links";
import "../imports/api/events.js";
import "../imports/api/sensors.js";
import "../imports/api/tags.js";
import "/api/methods.js";
//import { Ruteador } from "/imports/startup/client/routes.js";

Meteor.startup(() => {
  //  render(Ruteador(), document.getElementById("app"));
  let server = Meteor.settings.mqttHost;
  Events.mqttConnect(server, ["nivel/+"], { insert: true });
});
