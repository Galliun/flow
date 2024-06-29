// Dependence
import 'dotenv/config';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';

// Local imports
import config from "../../../config.json" assert { type: "json" };
import { getClient, getKeypair } from "../../utils/suiUtils.js";
import { getCoolerFactoryId, getPacakgeId } from "../../utils/waterCooler.js";

// Get the price for buying a Water Cooler from the Water Cooler protocol
// from the Water Cooler Factory
export const getCoolerPrice = async () => {
  return new Promise(async (res, rej) => {
    const client = getClient();
    const coolerFactoryId = getCoolerFactoryId();



    const keypair = getKeypair();

  const packageId = getPacakgeId();
  const tx = new Transaction();

  tx.setGasBudget(config.gasBudgetAmount);

  tx.moveCall({
    target: `${packageId}::cooler_factory::get_fee`,
    arguments: [
      tx.object(coolerFactoryId)
    ]
  });


  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  console.log("result", result);

  const txBlock = await client.getTransactionBlock({
    digest: result?.digest,
    // only fetch the effects field
    // options: {
    //   showEffects: false,
    //   showInput: false,
    //   showEvents: false,
    //   showObjectChanges: true,
    //   showBalanceChanges: false,
    // },
  });

  
  console.log("txBlock", txBlock);




    // const coolerFactory = await client.getObject({
    //   id: coolerFactoryId,
    //   // fetch the object content field
    //   options: { showContent: true },
    // });

    // // To Do: fix this any casting
    // const response = coolerFactory?.data?.content;

    // res(response?.fields?.fee);
    // res(response?.fields?.fee);



    
  });
}
