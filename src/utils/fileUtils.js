// Node imports
import fs from 'node:fs';

export const writeFile = (fileName, object) => {
  return new Promise(async (resolve, reject) => {
    const folderName = '.outputs';

    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
      reject({success: false});
    }
  
    const writeStream = await fs.createWriteStream(`.outputs/${fileName}.json`, { flags: 'w' });
    await writeStream.write(JSON.stringify(object, null, 4));
    await writeStream.end();

    resolve({success: true});
  });
}

export const readFile = (fileName) => {
  return new Promise(async (resolve, reject) => {

    // This path is used to check of the file exists because fs.existsSync checks from the current working dir
    const dataPath = `.outputs/${fileName}.json`;

    // This is used to read the data into the file as the import is done from the current file location directory
    const dataObject = `./../../.outputs/${fileName}.json`;

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