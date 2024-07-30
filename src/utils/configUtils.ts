// Node imports
import fs from 'node:fs';

import config from "../../config.json";
import {ConfigInterface} from '../interface/configInterface'
import {NETWORK} from '../constants'

export const updateFullConfig = (updated_config: any) => {
  return new Promise(async (res, rej) => {
    const writeStream = await fs.createWriteStream("./config.json", { flags: 'w' });
    await writeStream.write(JSON.stringify(updated_config, null, 4));
    await writeStream.end();

    res({success: true});
  });
}


export const updateConfig = <K extends keyof ConfigInterface>(key: K, value: ConfigInterface[K]) => {
  return new Promise(async (res, rej) => {
    try {
      let updated_config = { ...config } as ConfigInterface;
      updated_config[key] = value as any; // Type assertion to prevent type error

      const writeStream = fs.createWriteStream("./config.json", { flags: 'w' });
      writeStream.write(JSON.stringify(updated_config, null, 4), (err) => {
        if (err) {
          rej(err);
        } else {
          writeStream.end();
          res({ success: true });
        }
      });
    } catch (error) {
      rej(error);
    }
    
  });
}

export const getConfig = (key: keyof ConfigInterface) => {
    return config[key];
}

export const updateNestedConfig = <K extends NETWORK, K2 extends keyof ConfigInterface[K]>(key1: K, key2: K2, value: any) => {
  return new Promise(async (res, rej) => {
    let updated_config = config;
    updated_config[key1][key2] = value;

    const writeStream = await fs.createWriteStream("./config.json", { flags: 'w' });
    await writeStream.write(JSON.stringify(updated_config, null, 4));
    await writeStream.end();

    res({success: true});
  });
}


export const getNestedConfig = <
  K extends NETWORK,
  K2 extends keyof ConfigInterface[K]
>(key1: K, key2: K2): ConfigInterface[K][K2] => {
  const section = config[key1];
  if (section && key2 in section) {
    return section[key2];
  }
  throw new Error(`Invalid key: ${String(key2)} for section: ${String(key1)}`);
};