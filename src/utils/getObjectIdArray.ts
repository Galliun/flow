// Node imports
import fs from 'fs';
import { getPacakgeId } from './waterCooler.js';

// This path is used to check of the file exists because fs.existsSync checks from the current working dir
const dataPath = '.outputs/initialization.json';

// This is used to read the data into the file as the import is done from the current file location directory
const initializationData = '../.outputs/initialization.json';

export const getObjectIdArray = (type) => {
  return new Promise(async (resolve, reject) => {
    const packageId = getPacakgeId();

    // find the object that has the type "published"
    function objectType(object) {
      return object.objectType == `${packageId}${type}`;
    };

    try {
      const filePath = new URL(initializationData, import.meta.url);

      const exists = await fs.existsSync(dataPath);

      if (exists) {
        // This was the only way to get the file without using an import which will throw an error if the file doesn't exist
        const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        // Search objectChange to find all objects of a specific type
        const objects = jsonContent?.objectChanges?.filter(objectType);

        // let objectIds = [];

        const objectIds = objects.map(object => object.objectId);

      
        // Return package ID
        resolve(objectIds);
      } else {
        // console.log("The project has not been deployed yet.");
        reject("The Water Cooler has not been initialized");
      }

    } catch (error) {
      reject("The Water Cooler has not been initialized");
    }
  });
};