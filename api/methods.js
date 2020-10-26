//este código tiene que estar disponible en servidor y cliente, para habilitar Optimistic UI.
import { ValidatedMethod } from "meteor/mdg:validated-method";

export const updateEvent = new ValidatedMethod({
  name: "updateEvent",
  validate: new SimpleSchema({
    sensorname: { type: String },
    llenados: { type: Number }
  }).validator(),
  run(one) {
    Events.update(
      { topic: one.sensorname, activo: true },
      {
        $set: {
          llenados: one.llenados
        }
      }
    );
  }
});

export const insertSensor = new ValidatedMethod({
  name: "sensors.insert",
  validate: new SimpleSchema({
    codigo: { type: String },
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
  }).validator(),
  run(one) {
    one.activo = true;
    Sensors.insert(one);
  }
});
