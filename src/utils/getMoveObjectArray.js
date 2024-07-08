// Node imports
import fs from 'fs';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';

import { getPacakgeId } from './waterCooler.js';
import config from "../../config.json" assert { type: "json" };
import { getClient } from "./suiUtils.js";

export const getMoveObjectArray = (type, jsonContent) => {
  return new Promise(async (resolve, reject) => {
    const packageId = getPacakgeId();
    const client = getClient();

    // find the object that has the type "published"
    function objectType(object) {
      return object.objectType == `${packageId}${type}`;
    };

    try {
        const objects = jsonContent?.objectChanges?.filter(objectType);
        const objectIds = objects.map(object => object.objectId);

        const moveObjects = [];

        for (let i = 0; i < objectIds.length; i++) {
          const element = objectIds[i];
          
          const tx = new Transaction();

          tx.setGasBudget(config.gasBudgetAmount);

          const moveObject = await client.getObject({
            id: element,
            options: {
              showContent: true
            },
          });

          moveObjects.push(moveObject);
        }

        resolve(moveObjects);
    } catch (error) {
      reject("The Water Cooler has not been initialized");
    }
  });
};
