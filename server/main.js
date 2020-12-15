import { Meteor } from "meteor/meteor";
import { LinksCollection } from "/imports/api/links";
import "../imports/api/events.js";
import "../imports/api/sensors.js";
import "../imports/api/tags.js";
import "/api/server/publications.js";
import "/api/methods.js";
//import { Ruteador } from "/imports/startup/client/routes.js";

Meteor.startup(() => {
  //  render(Ruteador(), document.getElementById("app"));
  let server = Meteor.settings.mqttHost;
  //Events.mqttConnect(server, ["nivel/+"], { insert: true });
  listaTag = Tags.find({ activo: true }).fetch();
  const arrayTags = new Array();
  var i = 0;
  Tags.find({ activo: true }).forEach(unTag => {
    arrayTags.push(unTag.tag + "/+");
  });
  console.log(arrayTags);
  Events.mqttConnect(server, arrayTags, { insert: true });
  //Events.mqttConnect(server, [], { insert: true });
});
