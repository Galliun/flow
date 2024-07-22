// Dependence
import 'dotenv/config';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';

// Local imports
import config from "../../../config.json";
import data from "../../../assets/metadata.json";
import { getClient, getKeypair } from "../../utils/suiUtils";
import { getPacakgeId } from "../../utils/waterCooler";
import { writeFile, readFile } from "../../utils/fileUtils";
import { 
  MINT_ADMIN_CAP_ID,
  WATER_COOLER_ADMIN_ID,
  WATER_COOLER_ID,
  COLLECTION_ID,
  REGISTRY_ID,
  CAPSULE_IDS,
  REVEAL,
  BUY,
  INIT_OBJECTS
 } from "../../constants";
import { buyObjectInterface } from '../../interface/buyObjectInterface';
import {InitObjectInterface} from "../../interface/initObjectInterface";

function findNFT(objectsResponse: any[], number: number) {
  for (const nftObject of objectsResponse) {
    if ('data' in nftObject && nftObject.data && 'content' in nftObject.data && nftObject.data.content && 'fields' in nftObject.data.content) {
      const objectNumber = parseInt(nftObject.data.content.fields.number);
      if (objectNumber === number) {
        return nftObject;
      }
    }
  }
  return null;
}

export default async () => {
  console.log("Revealing NFTs");

  const buyObject = await readFile(`${config.network}_${BUY}`) as buyObjectInterface;
  const initObject = await readFile(`${config.network}_${INIT_OBJECTS}`) as InitObjectInterface;
  const keypair = getKeypair();
  const client = getClient();
  const packageId = getPacakgeId();


  let revealObject = [];

  for (let i = 0; i < data.metadata.length; i++) {
    console.log(`Revealing NFT #${i + 1}`);
    const nftData = data.metadata[i];    

    let nftMoveObject = findNFT(initObject[CAPSULE_IDS], nftData.number);

    const tx = new Transaction();

    const dataKeys = Object.keys(nftData.attributes);
    const dataValues: any[] = Object.values(nftData.attributes);

    let pureKeys = dataKeys.map(key => tx.pure.string(key));
    let pureValues = dataValues.map(value => tx.pure.string(value));

    let dataObject: {number: number | null, digest: string | null} = {number:null, digest: null};

    tx.setGasBudget(config.gasBudgetAmount);

    const keys = tx.makeMoveVec({
      type: `0x1::string::String`,
      elements: pureKeys
    });

    const values = tx.makeMoveVec({
      type: `0x1::string::String`,
      elements: pureValues
    });

    // old
    // tx.moveCall({
    //   target: `${packageId}::orchestrator::admin_reveal_nft`,
    //   arguments: [
    //     tx.object(buyObject[MINT_ADMIN_CAP_ID]),
    //     tx.object(buyObject[REGISTRY_ID]),
    //     tx.object(nftMoveObject?.data?.objectId),
    //     keys,
    //     values,
    //     tx.pure.string(nftData.image_url),
    //   ]
    // });
    
    tx.moveCall({
      target: `${packageId}::water_cooler::reveal_nft`,
      arguments: [
        tx.object(buyObject[WATER_COOLER_ADMIN_ID]),
        tx.object(buyObject[WATER_COOLER_ID]),
        tx.object(buyObject[REGISTRY_ID]),
        tx.object(buyObject[COLLECTION_ID]),
        tx.object(nftMoveObject?.data?.objectId),
        keys,
        values,
        tx.pure.string(nftData.image_url),
      ]
    });

    const objectChange = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: { showObjectChanges: true },
    });

    dataObject.number = i + 1;
    dataObject.digest = objectChange?.digest;

    revealObject.push(dataObject);

    console.log(`NFT #${i + 1} has been revealed`);
  }

  await writeFile(`${config.network}_${REVEAL}`, revealObject);

  console.log("NFT reveal complete.");
}
