// Dependence
import 'dotenv/config';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';
import inquirer from 'inquirer';

// Local imports
import config from "../../../config.json";
// @ts-ignore
import collection from "../../../collection.json";
import { getClient, getKeypair, mistToSui } from "../../utils/suiUtils";
import { getCoolerFactoryId, getPacakgeId, getWaterCoolerDetails } from "../../utils/waterCooler";
import { getObjectIdJson } from "../../utils/getObjectIdJson";
import { getCoolerPrice } from "../helpers/getCoolerPrice";
import { writeFile } from "../../utils/fileUtils";
import { 
  WATER_COOLER,
  WATER_COOLER_ID,
  WATER_COOLER_ADMIN,
  WATER_COOLER_ADMIN_ID,
  REGISTRY, REGISTRY_ID,
  REGISTRY_ADMIN,
  REGISTRY_ADMIN_CAP_ID,
  MINT_SETTINGS,
  MINT_SETTING_ID,
  MINT_WAREHOUSE,
  MINT_WAREHOUSE_ID,
  MINT_ADMIN,
  MINT_ADMIN_CAP_ID,
  COLLECTION,
  COLLECTION_ID,
  DIGEST,
  BUY
 } from "../../constants";
import { buyObjectInterface } from '../../interface/buyObjectInterface';
import { isCollectionFilled } from "../../utils/collectionUtils";



// Buy a Water Cooler from the Factory in the Water Cooler Protocol
export default async () => {
  const price = await getCoolerPrice();

  // Before asking to buy, ensure that collection.json is filled. Otherwise, an error will occur
  isCollectionFilled(collection)


  const prompt = inquirer.createPromptModule();
  const answers = await prompt([
    {
      type: "input",
      name: "confirm",
      message: `Do you want to buy a Water Cooler(to create a new collection) for ${mistToSui(price)} $SUI?(yes/y or no/n):`
    }
  ]);

  // Execute buy order to protocol
  if(answers.confirm === "y" || answers.confirm === "yes") {
    console.log(`Ordering Water Cooler now.`);

    // const CoolerDetails = await getWaterCoolerDetails();
    console.log("Shipping... Your Water Cooler will arrive soon");

    // const { name, description, supply, treasury, image_url, placeholder_image_url } = CoolerDetails;
    const keypair = getKeypair();
    const client = getClient();
    const packageId = getPacakgeId();
    const tx = new Transaction();

    tx.setGasBudget(config.gasBudgetAmount);

    const [coin] = tx.splitCoins(tx.gas, [price]);
    const coolerFactoryId = getCoolerFactoryId();

    tx.moveCall({
      target: `${packageId}::cooler_factory::buy_water_cooler`,
      arguments: [
        tx.object(coolerFactoryId),
        coin,
        tx.pure.string(collection.name),
        tx.pure.string(collection.description),
        tx.pure.string(collection.image_url),
        tx.pure.string(collection.placeholder_image_url),
        tx.pure.u64(collection.supply),
        tx.pure.address(collection.treasury)
      ]
    });
    const objectChange = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: { showObjectChanges: true }
    });

    let buyObjects: buyObjectInterface = {
      WATER_COOLER_ID: null,
      WATER_COOLER_ADMIN_ID: null,
      REGISTRY_ID: null,
      REGISTRY_ADMIN_CAP_ID: null,
      MINT_SETTING_ID: null,
      MINT_WAREHOUSE_ID: null,
      MINT_ADMIN_CAP_ID: null,
      COLLECTION_ID: null,
      DIGEST: ''
    };

    buyObjects.WATER_COOLER_ID= await getObjectIdJson(WATER_COOLER, objectChange);
    buyObjects.WATER_COOLER_ADMIN_ID = await getObjectIdJson(WATER_COOLER_ADMIN, objectChange);
    buyObjects.REGISTRY_ID = await getObjectIdJson(REGISTRY, objectChange);
    buyObjects.REGISTRY_ADMIN_CAP_ID = await getObjectIdJson(REGISTRY_ADMIN, objectChange);
    buyObjects.MINT_SETTING_ID = await getObjectIdJson(MINT_SETTINGS, objectChange);
    buyObjects.MINT_WAREHOUSE_ID = await getObjectIdJson(MINT_WAREHOUSE, objectChange);
    buyObjects.MINT_ADMIN_CAP_ID = await getObjectIdJson(MINT_ADMIN, objectChange);
    buyObjects.COLLECTION_ID = await getObjectIdJson(COLLECTION, objectChange);;
    buyObjects.DIGEST = objectChange?.digest;

    await writeFile(`${config.network}_${BUY}`, buyObjects);
    console.log(`You can check output file here: output/${config.network}_${BUY}`)
    console.log("Your Water Cooler has arrived.");
  } else {
    console.log(`Order canceled`);
  }
}
