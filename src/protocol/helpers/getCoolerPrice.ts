// Dependence
import 'dotenv/config';

// Local imports
import { getClient } from "../../utils/suiUtils";
import { getCoolerFactoryId } from "../../utils/waterCooler";

// Get the price for buying a Water Cooler from the Water Cooler protocol
// from the Water Cooler Factory
export const getCoolerPrice = async (): Promise<any> => {
  return new Promise(async (res, rej) => {
    try {
      const client = getClient();
      const coolerFactoryId = getCoolerFactoryId();

      const coolerFactory = await client.getObject({
        id: coolerFactoryId,
        // fetch the object content field
        options: { showContent: true, },
      });

      const response = coolerFactory?.data?.content;
      
      if (response && "fields" in response) {
        res((response as any).fields.fee);
      } else {
        rej("The 'fields' property does not exist on the response object.");
      }
    } catch (error) {
      if(error instanceof Error){
        rej(`An error occurred: ${error.message}`);
      }
    }
  });
}
