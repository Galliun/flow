// Node imports
import { getPacakgeId } from './waterCooler.js';

export const getObjectIdJson = (type, jsonContent) => {
  return new Promise(async (resolve, reject) => {
    const packageId = getPacakgeId();

    // find the object that has the type "published"
    function objectType(object) {
      return object.objectType == `${packageId}${type}`;
    };

    try {
      // Search objectChange to find object type
      const object = jsonContent?.objectChanges?.find(objectType);
    
      // Return package ID
      resolve(object?.objectId);

    } catch (error) {
      reject("Error while retriving ID from json object");
    }
  });
};
