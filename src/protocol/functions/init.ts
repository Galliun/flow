// Dependence
import 'dotenv/config';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';

// Local imports
import config from "../../../config.json";
import { getClient, getKeypair } from "../../utils/suiUtils";
import { getPacakgeId } from "../../utils/waterCooler";
import { writeFile, readFile } from "../../utils/fileUtils";
import { getMoveObjectArray } from "../../utils/getMoveObjectArray";
import { getObjectIdArrayFromObject } from "../../utils/getObjectIdArray";
import { 
  WATER_COOLER_ID,
  WATER_COOLER_ADMIN_ID,
  REGISTRY_ID,
  COLLECTION_ID,
  DIGEST,
  INIT,
  INIT_OBJECTS,
  BUY,
  MIZU_NFT,
  MIZU_NFT_IDS
 } from "../../constants";
import { buyObjectInterface } from '../../interface/buyObjectInterface';
import {InitObjectInterface} from "../../interface/initObjectInterface";

export default async () => {
  console.log("Initiate Water Cooler");

  const buyObject = await readFile(`${config.network}_${BUY}`) as buyObjectInterface;
  const keypair = getKeypair();
  const client = getClient();
  const packageId = getPacakgeId();
  const tx = new Transaction();

  tx.setGasBudget(config.gasBudgetAmount);
  
  tx.moveCall({
    target: `${packageId}::water_cooler::initialize_water_cooler`,
    arguments: [
      tx.object(buyObject[WATER_COOLER_ADMIN_ID]),
      tx.object(buyObject[WATER_COOLER_ID]),
      tx.object(buyObject[REGISTRY_ID]),
      tx.object(buyObject[COLLECTION_ID]),
    ]
  });

  const objectChange = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: { showObjectChanges: true },
  });
  
  let initObjects: InitObjectInterface = {
    mizuNFTIDs: [{}],
    digest: "",
  };
  const mizuNFTIdArrayObjects = await getMoveObjectArray(MIZU_NFT, objectChange);
  initObjects[MIZU_NFT_IDS] = mizuNFTIdArrayObjects as [any];
  initObjects[DIGEST] = objectChange?.digest;
  await writeFile(`${config.network}_${INIT_OBJECTS}`, initObjects);
  
  
  let initObjectIds: InitObjectInterface = {
    mizuNFTIDs: [{}],
    digest: "",
  };
  const mizuNFTIdArray = await getObjectIdArrayFromObject(MIZU_NFT, objectChange);
  initObjectIds[MIZU_NFT_IDS] = mizuNFTIdArray as [any];
  initObjectIds[DIGEST] = objectChange?.digest;
  await writeFile(`${config.network}_${INIT}`, initObjectIds);

  console.log("Your Water Cooler has been initiated.");
}
