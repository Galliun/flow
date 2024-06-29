// Dependence
import 'dotenv/config';

// Node imports
import fs from 'node:fs';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';
import inquirer from 'inquirer';

// Local imports
import config from "../../../config.json" assert { type: "json" };
import { getClient, getKeypair, mistToSui } from "../../utils/suiUtils.js";
import { getCoolerFactoryId, getPacakgeId, getWaterCoolerDetails, delay } from "../../utils/waterCooler.js";
import { getCoolerPrice } from "../helpers/getCoolerPrice.js";


// Buy a Water Cooler from the Factory in the Water Cooler Protocol
export default async () => {
  const price = await getCoolerPrice();

  const prompt = inquirer.createPromptModule();
  const answers = await prompt([
    {
      type: "input",
      name: "confirm",
      message: `You are about to buy a Water Cooler for ${mistToSui(price)} $SUI. To confirm type y or n to cancel:`
    }
  ]);

  // Execute buy order to protocol
  if(answers.confirm == "y") {
    console.log(`Ordering Water Cooler now.`);

    const CoolerDetails = await getWaterCoolerDetails();

    console.log("Shipping... Your Water Cooler will arrive soon");

    const { name, description, size, treasury, image_url } = CoolerDetails;

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
        tx.object(coolerFactoryId), coin,
        tx.pure.string(name), tx.pure.string(description),
        tx.pure.string(image_url), tx.pure.u16(size),
        tx.pure.address(treasury)
      ]
    });
  
    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    });

    // Wait for the transaction to be finalised
    await delay(5000); // Wait 5 seconds

    const objectChange = await client.getTransactionBlock({
      digest: result?.digest,
      // only fetch the effects field
      options: {
        showEffects: false,
        showInput: false,
        showEvents: false,
        showObjectChanges: true,
        showBalanceChanges: false,
      },
    });

    const folderName = '.outputs';

    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
    }
  
    const writeStream = fs.createWriteStream("../../.outputs/water_cooler.json", { flags: 'w' });
      writeStream.write(JSON.stringify(objectChange, null, 4));
      writeStream.end();
  
    console.log("Your Water Cooler has arrived.");

  } else {
    console.log(`Buy order canceled.`);
  }
}
