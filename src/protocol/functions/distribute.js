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
import readTickets from "../../utils/readTickets.js";
import { readFile } from "../../utils/fileUtils.js";
import { getNestedObjectIdConfig } from "../../utils/getObjectIdConfig.js";
import { MINT_ADMIN_CAP_ID, MINT_WAREHOUSE_ID, BUY } from "../../constants.js";

const distributeTickets = async (ticketType) => {

    console.log("Starting distributuion...");

    const keypair = getKeypair();
    const client = getClient();
    const packageId = getPacakgeId();
    const buyObject = await readFile(`${config.network}_${BUY}`);
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
                    tx.object(buyObject[MINT_WAREHOUSE_ID]),
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


export default async (options) => {
    if (options.og) {
        console.log(`distribute OG tickets`);
        distributeTickets("og");
    }
    
    if (options.wl) {
        console.log(`distribute White List tickets`);
        distributeTickets("wl");
    }
}
