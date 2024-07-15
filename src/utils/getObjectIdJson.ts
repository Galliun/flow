// Node imports
import { getPacakgeId } from './waterCooler';

export const getObjectIdJson = (type: string, jsonContent: any) => {
  return new Promise(async (resolve, reject) => {
    const packageId = getPacakgeId();

    // find the object that has the type "published"
    function objectType(object: any) {
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
