import { Mongo } from "meteor/mongo";

import { SimpleSchema } from "meteor/aldeed:simple-schema";

export default (Tags = new Mongo.Collection("tags"));

Tags.schema = new SimpleSchema({
  tag: { type: String },
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

Tags.attachSchema(Tags.schema);
