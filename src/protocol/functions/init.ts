// Dependence
import 'dotenv/config';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';
import chalk from 'chalk';
import boxen from 'boxen';

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
  CAPSULE,
  CAPSULE_IDS
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

  const waterColler = await client.getObject({
    id: buyObject[WATER_COOLER_ID],
    options: { showContent: true }
  });

  const response = waterColler?.data?.content;
  
  if (response && "fields" in response) {
    if((response as any).fields.is_initialized) {
      console.error(`${chalk.blue.bold("[Info]")} Your Water Cooler has already been initialized.`);
      process.exit(1);
    }
  }

  tx.moveCall({
    target: `${packageId}::water_cooler::initialize_water_cooler`,
    arguments: [
      tx.object(buyObject[WATER_COOLER_ADMIN_ID]),
      tx.object(buyObject[WATER_COOLER_ID]),
      tx.object(buyObject[REGISTRY_ID]),
      tx.object(buyObject[COLLECTION_ID]),
    ]
  });

  try {
    const objectChange = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: {
        showObjectChanges: true
      },
    });

    let initObjects: InitObjectInterface = {
      CapsuleIDs: [{}],
      digest: "",
    };

    const capsuleIdArrayObjects = await getMoveObjectArray(CAPSULE, objectChange);
    initObjects[CAPSULE_IDS] = capsuleIdArrayObjects as any[];
    initObjects[DIGEST] = objectChange?.digest;
    await writeFile(`${config.network}_${INIT_OBJECTS}`, initObjects);
    
    
    let initObjectIds: InitObjectInterface = {
      CapsuleIDs: [{}],
      digest: "",
    };
    const mizuNFTIdArray = await getObjectIdArrayFromObject(CAPSULE, objectChange);
    initObjectIds[CAPSULE_IDS] = mizuNFTIdArray as [any];
    initObjectIds[DIGEST] = objectChange?.digest;
    await writeFile(`${config.network}_${INIT}`, initObjectIds);

    const titleMessage = "Water Cooler Initilized"
    const output = boxen(
        `${chalk.bold('Congratulation:')} ${chalk.green('Your Water Cooler has been initilized')}\n\n${chalk.bold('The NFTs for your collection has been created.')}`,
        { title: titleMessage, padding: 1, margin: 1, borderStyle: 'double' }
    );

    console.log(output)

  } catch (error: any) {
    console.log("Error initilising the water cooler.");
  }


}
