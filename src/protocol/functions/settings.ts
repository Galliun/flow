// Dependence
import 'dotenv/config';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';

// Local imports
import config from "../../../config.json";
import { getClient, getKeypair } from "../../utils/suiUtils";
import { getPacakgeId } from "../../utils/waterCooler";
import { readFile } from "../../utils/fileUtils";
import { MINT_ADMIN_CAP_ID, MINT_SETTING_ID, BUY } from "../../constants";
import {buyObjectInterface} from '../../interface/buyObjectInterface';

export default async (options: any) => {
    const buyObject = await readFile(`${config.network}_${BUY}`) as buyObjectInterface;

    const mintAdminCapObjectId = buyObject.MINT_ADMIN_CAP_ID
    const mintSettingsObjectId = buyObject.MINT_SETTING_ID

    if (options.amount) {
        console.log(`Changing mint price to: ${options.amount}`);

        const amount = parseInt(options.amount);
    
        const keypair = getKeypair();
        const client = getClient();
    
        const packageId = getPacakgeId();
        const tx = new Transaction();
    
        tx.setGasBudget(config.gasBudgetAmount);
    
        tx.moveCall({
            target: `${packageId}::mint::set_mint_price`,
            arguments: [
            tx.object(buyObject.MINT_ADMIN_CAP_ID),
            tx.object(buyObject.MINT_SETTING_ID),   
            tx.pure.u64(amount),
            ]
        });
    
        await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
        });
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
            tx.object(mintSettingsObjectId),   
            tx.pure.u8(phase),
            ]
        });
    
        await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
        });
    }
    
    if (options.status) {
        console.log(`Changing mint status to: ${options.status}`);

        const status = parseInt(options.status);

    
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
    
        await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
        });
    }
}
