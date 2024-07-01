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

        const amount = parseInt(options.amount);
    
        const keypair = getKeypair();
        const client = getClient();
    
        const packageId = getPacakgeId();
        const tx = new Transaction();
    
        tx.setGasBudget(config.gasBudgetAmount);
    
        tx.moveCall({
            target: `${packageId}::mint::set_mint_price`,
            arguments: [
            tx.object(mintAdminCapObjectId),
            tx.object(mintSettingsObjectId),   
            tx.pure.u64(amount),
            ]
        });
    
        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
        });
    
        console.log("Price Transaction result:", result); // Log transaction result
    }
    
    if (options.phase) {
        console.log(`Changing mint phase to: ${options.phase}`);
        
        const phase = parseInt(options.phase);

        console.log("Phase:", phase);
    
        const keypair = getKeypair();
        const client = getClient();
    
        const packageId = getPacakgeId();
        const tx = new Transaction();
    
        tx.setGasBudget(config.gasBudgetAmount);
    
        tx.moveCall({
            target: `${packageId}::mint::set_mint_phase`,
            arguments: [
            tx.object(mintAdminCapObjectId),
            tx.object(mintSettingsObjectId),   
            tx.pure.u8(phase),
            ]
        });
    
        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
        });
    
        console.log("Transaction result:", result); // Log transaction result
    }
    
    if (options.status) {
        console.log(`Changing mint status to: ${options.status}`);
        
        const status = parseInt(options.status);

        console.log("Status:", status);
    
        const keypair = getKeypair();
        const client = getClient();
    
        const packageId = getPacakgeId();
        const tx = new Transaction();
    
        tx.setGasBudget(config.gasBudgetAmount);
    
        tx.moveCall({
            target: `${packageId}::mint::set_mint_status`,
            arguments: [
            tx.object(mintAdminCapObjectId),
            tx.object(mintSettingsObjectId),   
            tx.pure.u8(status),
            ]
        });
    
        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
        });
    
        console.log("Status transaction result:", result); // Log transaction result
    }
}
