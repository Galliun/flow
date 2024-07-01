// Dependence
import 'dotenv/config';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';

// Local imports
import config from "../../../config.json" assert { type: "json" };
import { getClient, getKeypair } from "../../utils/suiUtils.js";
import { getPacakgeId } from "../../utils/waterCooler.js";
import { getObjectId } from "../../utils/getObjectId.js";
import { MINT_ADMIN, MINT_SETTINGS } from "../../constants.js";


export default async (options) => {

    const mintAdminCapObjectId = await getObjectId(MINT_ADMIN);
    console.log("mintAdminCapObjectId", mintAdminCapObjectId);
    const mintSettingsObjectId = await getObjectId(MINT_SETTINGS);
    console.log("mintSettingsObjectId", mintSettingsObjectId);

    if (options.amount) {
        console.log(`Changing mint price to: ${options.amount}`);
        // logic to change the NFT mint price ...
    }
    
    if (options.phase) {
        console.log(`Changing mint phase to: ${options.phase}`);
        
        const phase = parseInt(options.phase);
    
        const keypair = getKeypair();
        const client = getClient();
    
        const packageId = getPacakgeId();
        const tx = new Transaction();
    
        tx.setGasBudget(config.gasBudgetAmount);
    
        tx.moveCall({
            target: `${packageId}::mint::set_mint_phase`,
            arguments: [
            tx.object(mintAdminCapObjectId),
            tx.pure.u8(phase),
            tx.object(mintSettingsObjectId),   
            ]
        });
    
        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
        });
    
        console.log("Transaction result:", result); // Log transaction result
    }
}
