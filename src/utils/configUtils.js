// Node imports
import fs from 'node:fs';

import config from "../../config.json" assert { type: "json" };

export const updateConfig = (key, value) => {
  return new Promise(async (res, rej) => {
    let updated_config = config;
    updated_config[key] = value;

    const writeStream = await fs.createWriteStream("./config.json", { flags: 'w' });
    await writeStream.write(JSON.stringify(updated_config, null, 4));
    await writeStream.end();

    res({success: true});
  });
}

export const getConfig = (key) => {
    return config[key];
}

export const updateNestedConfig = (key1, key2, value) => {
  return new Promise(async (res, rej) => {
    let updated_config = config;
    updated_config[key1][key2] = value;

    const writeStream = await fs.createWriteStream("./config.json", { flags: 'w' });
    await writeStream.write(JSON.stringify(updated_config, null, 4));
    await writeStream.end();

    res({success: true});
  });
}

export const getNestedConfig = (key1, key2) => {
    return config[key1][key2];
}