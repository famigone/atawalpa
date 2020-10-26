import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
export default Events = new Meteor.Collection("events");

Events.schema = new SimpleSchema({
  topic: { type: String },
  message: { type: String },
  //este campo se incrementa en +1 cada vez que el sensor lee nivel al piso, es decir, cuando
  //retiran la batea. Sirve para contar la cantidad de bateas que se llenaron, y también
  //para reconstruir la serie temporal de cada llenado...


  llenados: {
    type: Number,
    optional: false,
  defaultValue: 0},
  createdAt: {
    type: Date,
    optional: true,
    autoValue: function() {
      return new Date();
    }
  },
  activo: {
    type: Boolean,
    optional: true,
    autoValue: function() {
      return true;
    }
  } //borrado lógico
});

Events.attachSchema(Events.schema);
