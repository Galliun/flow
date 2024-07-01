// Node imports
import fs from 'fs';
import { getPacakgeId } from './waterCooler.js';

// This path is used to check of the file exists because fs.existsSync checks from the current working dir
const dataPath = '.outputs/water_cooler.json';

// This is used to read the data into the file as the import is done from the current file location directory
const waterCoolerData = './../../.outputs/water_cooler.json';

export const getObjectId = (type) => {
  return new Promise(async (resolve, reject) => {
    const packageId = getPacakgeId();

    // find the object that has the type "published"
    function objectType(object) {
      return object.objectType == `${packageId}${type}`;
    };

    try {
      const filePath = new URL(waterCoolerData, import.meta.url);

      const exists = await fs.existsSync(dataPath);

      if (exists) {
        // This was the only way to get the file without using an import which will throw an error if the file doesn't exist
        const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        // Search objectChange to find object type
        const object = jsonContent?.objectChanges?.find(objectType);

      
        // Return package ID
        resolve(object?.objectId);
      } else {
        // console.log("The project has not been deployed yet.");
        reject("No Water Cooler was found");
      }

    } catch (error) {
      reject("No Water Cooler was found");
    }
  });
};