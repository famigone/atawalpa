import { Mongo } from "meteor/mongo";

import { SimpleSchema } from "meteor/aldeed:simple-schema";
import Tags from "./tags.js";
export default (Sensors = new Mongo.Collection("sensors"));

Sensors.schema = new SimpleSchema({
  codigo: { type: String },
  descripcion: { type: String },
  tagId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  activo: {
    type: Boolean,
    optional: true,
    autoValue: function() {
      return true;
    }
  }, //borrado lógico
  createdBy: {
    type: String,
    optional: true,
    autoValue: function() {
      return this.userId;
    }
  },
  createdAt: {
    type: Date,
    optional: true,
    autoValue: function() {
      return new Date();
    }
  }
});

Sensors.helpers({
  tag() {
    tagId = this.tagId;
    const elTag = Tags.findOne(tagId);
    if (!!elTag) return elTag.tag;
    else return "";
  }
});

Sensors.attachSchema(Sensors.schema);
