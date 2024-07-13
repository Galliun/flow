// Node imports
import configRaw from "../../config.json";
import {ConfigInterface, NetworkConfig} from "../interface/configInterface";
import { NETWORK } from "../constants";
export const getObjectIdConfig = (key: keyof ConfigInterface) => {
  return configRaw[key];
};

export const getNestedObjectIdConfig = <
 K extends NETWORK,
 K2 extends keyof ConfigInterface[K]
>(key1: K, key2: K2) => {
  const config = configRaw as ConfigInterface
  return config[key1][key2];
};