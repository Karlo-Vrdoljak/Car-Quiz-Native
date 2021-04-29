// global.__DEV__ = true;
// import Realm from "realm";

const TaskSchema = {
    name: "Quiz",
    properties: {
      _id: "int",
      name: "string",

    },
    primaryKey: "_id",
  };

export default {
    schema: TaskSchema
};