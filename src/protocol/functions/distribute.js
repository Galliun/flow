// Dependence
import 'dotenv/config';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';

// Local imports
import config from "../../../config.json" assert { type: "json" };
import og from "../../../assets/og.json" assert { type: "json" };
import wl from "../../../assets/wl.json" assert { type: "json" };

import { getClient, getKeypair } from "../../utils/suiUtils.js";
import { getPacakgeId } from "../../utils/waterCooler.js";
import { getObjectIdFile } from "../../utils/getObjectIdFile.js";
import { getNestedObjectIdConfig } from "../../utils/getObjectIdConfig.js";
import { MINT_ADMIN_CAP_ID, MINT_SETTING_ID } from "../../constants.js";


export default async (options) => {

    // // const mintAdminCapObjectId = await getObjectIdFile(MINT_ADMIN);
    // const mintAdminCapObjectId = await getNestedObjectIdConfig(config.network, MINT_ADMIN_CAP_ID);
    // console.log("mintAdminCapObjectId", mintAdminCapObjectId);
    // // const mintSettingsObjectId = await getObjectIdFile(MINT_SETTINGS);
    // const mintSettingsObjectId = await getNestedObjectIdConfig(config.network, MINT_SETTING_ID);
    // console.log("mintSettingsObjectId", mintSettingsObjectId);

    if (options.og) {
        console.log(`distribute OG tickets: ${options.og}`);
        // logic to change the NFT mint price ...

    //     const amount = parseInt(options.amount);
    
    //     const keypair = getKeypair();
    //     const client = getClient();
    
    //     const packageId = getPacakgeId();
    //     const tx = new Transaction();
    
    //     tx.setGasBudget(config.gasBudgetAmount);
    
    //     tx.moveCall({
    //         target: `${packageId}::mint::set_mint_price`,
    //         arguments: [
    //         tx.object(mintAdminCapObjectId),
    //         tx.object(mintSettingsObjectId),   
    //         tx.pure.u64(amount),
    //         ]
    //     });
    
    //     const result = await client.signAndExecuteTransaction({
    //         signer: keypair,
    //         transaction: tx,
    //     });
    
    //     console.log("Price Transaction result:", result); // Log transaction result
    }
    
    if (options.wl) {
        console.log(`distribute WL tickets: ${options.wl}`);
        
        // const phase = parseInt(options.phase);

        // console.log("Phase:", phase);
    
        // const keypair = getKeypair();
        // const client = getClient();
    
        // const packageId = getPacakgeId();
        // const tx = new Transaction();
    
        // tx.setGasBudget(config.gasBudgetAmount);
    
        // tx.moveCall({
        //     target: `${packageId}::mint::set_mint_phase`,
        //     arguments: [
        //     tx.object(mintAdminCapObjectId),
        //     tx.object(mintSettingsObjectId),   
        //     tx.pure.u8(phase),
        //     ]
        // });
    
        // const result = await client.signAndExecuteTransaction({
        //     signer: keypair,
        //     transaction: tx,
        // });
    
        // console.log("Transaction result:", result); // Log transaction result
    }
    
}
