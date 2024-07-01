// Node imports
import config from "../../config.json" assert { type: "json" };

export const getObjectIdConfig = (key) => {
  return config[key];
};

export const getNestedObjectIdConfig = (key1, key2) => {
  return config[key1][key2];
};