// Node imports
import fs from 'node:fs';

import config from "../../config.json" assert { type: "json" };

export const updateConfig = (key, value) => {
  return new Promise(async (res, rej) => {
    let updated_config = config;
    updated_config[key] = value;

    const writeStream = fs.createWriteStream("./config.json", { flags: 'w' });
    writeStream.write(JSON.stringify(updated_config, null, 4));
    writeStream.end();

    res({success: true});
  });
}

export const updateNestedConfig = (key1, key2, value) => {
  return new Promise(async (res, rej) => {
    let updated_config = config;
    updated_config[key1][key2] = value;

    const writeStream = fs.createWriteStream("./config.json", { flags: 'w' });
    writeStream.write(JSON.stringify(updated_config, null, 4));
    writeStream.end();

    res({success: true});
  });
}