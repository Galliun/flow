// Node imports
import fs from 'fs';
import { getPacakgeId } from './waterCooler';

// This path is used to check of the file exists because fs.existsSync checks from the current working dir
const dataPath = '.outputs/initialization.json';

// This is used to read the data into the file as the import is done from the current file location directory
const initializationData = '../.outputs/initialization.json';

export const getObjectIdArrayFromObject = (type: any, jsonContent: any) => {
  return new Promise(async (resolve, reject) => {
    const packageId = getPacakgeId();

    // find the object that has the type "published"
    function objectType(object: any) {
      return object.objectType == `${packageId}${type}`;
    };

    try {
        const objects = jsonContent?.objectChanges?.filter(objectType);
        const objectIds = objects.map((object: any) => object.objectId);
        resolve(objectIds);
    } catch (error) {
      reject("The Water Cooler has not been initialized");
    }
  });
};

export const getObjectIdArray = (type: any) => {
  return new Promise(async (resolve, reject) => {
    const packageId = getPacakgeId();

    // find the object that has the type "published"
    function objectType(object: any) {
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

        const objectIds = objects.map((object: any) => object.objectId);

        // Return package ID
        resolve(objectIds);
      } else {
        reject("The Water Cooler has not been initialized");
      }

    } catch (error) {
      reject("The Water Cooler has not been initialized");
    }
  });
};