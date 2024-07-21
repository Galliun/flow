// Dependence
import 'dotenv/config';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';

// Local imports
import config from "../../../config.json";

import { getClient, getKeypair } from "../../utils/suiUtils";
import { getPacakgeId } from "../../utils/waterCooler";
import readTickets from "../../utils/readTickets";
import { readFile } from "../../utils/fileUtils";
import { MINT_ADMIN_CAP_ID, WATER_COOLER_ID, BUY } from "../../constants";
import { buyObjectInterface } from '../../interface/buyObjectInterface';

const distributeTickets = async (ticketType: string) => {

    console.log("Starting distributuion...");

    const keypair = getKeypair();
    const client = getClient();
    const packageId = getPacakgeId();
    const buyObject = await readFile(`${config.network}_${BUY}`) as buyObjectInterface;
    const ticketListObject = await readTickets(ticketType);

    for (let i = 0; i < ticketListObject.ticketList.length; i++) {
        const ticketObject = ticketListObject.ticketList[i];
        
        for (let j = 0; j < ticketObject.amount; j++) {

            const address = ticketObject.address;

            const tx = new Transaction();

            tx.moveCall({
                target: `${packageId}::mint::create_${ticketType}_ticket`,
                arguments: [
                    tx.object(buyObject[MINT_ADMIN_CAP_ID]),
                    tx.object(buyObject[WATER_COOLER_ID]),
                    tx.object(address)
                ],
            });
    
            const objectChanges = await client.signAndExecuteTransaction({
                signer: keypair,
                transaction: tx,
                options: { showObjectChanges: true }
            });
    
            if (!objectChanges) {
                console.log("Error: objectChanges is null or undefined");
                process.exit(1);
            }

            console.log("Ticket sent to:", address);
        }
    }
    console.log(`All tickets have been distributed`);
}

type OptionsType = {og: string, wl: string}

export default async (options: OptionsType) => {
    if (options.og) {
        console.log(`distribute OG tickets`);
        distributeTickets("og");
    }
    
    if (options.wl) {
        console.log(`distribute White List tickets`);
        distributeTickets("wl");
    }
}
