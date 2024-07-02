// Node imports
import fs from 'node:fs';

export default (fileName, object) => {
  return new Promise(async (resolve, reject) => {
    const folderName = '.outputs';

    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
      reject({success: true});
    }
  
    const writeStream = await fs.createWriteStream(`.outputs/${fileName}.json`, { flags: 'w' });
    await writeStream.write(JSON.stringify(object, null, 4));
    await writeStream.end();

    resolve({success: true});
  });
}