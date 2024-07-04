// Node imports
import fs from 'node:fs';

export default (ticketType) => {
  return new Promise(async (resolve, reject) => {
    // This path is used to check of the file exists because fs.existsSync checks from the current working dir
    const dataPath = `assets/${ticketType}.json`;

    // This is used to read the data into the file as the import is done from the current file location directory
    const dataObject = `./../../assets/${ticketType}.json`;

    try {
      const filePath = new URL(dataObject, import.meta.url);

      const exists = await fs.existsSync(dataPath);

      if (exists) {
        // Import the json file as an object
        const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

        // Return json file as object
        resolve(jsonContent);
      } else {
        // console.log("The project has not been deployed yet.");
        reject("Error while retriving ID from json file");
      }

    } catch (error) {
      reject("Error while retriving ID from json file");
    }
  });
};