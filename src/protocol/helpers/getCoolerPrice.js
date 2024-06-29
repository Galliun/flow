// Dependence
import 'dotenv/config';

// Local imports
import { getClient } from "../../utils/suiUtils.js";
import { getCoolerFactoryId } from "../../utils/waterCooler.js";

// Get the price for buying a Water Cooler from the Water Cooler protocol
// from the Water Cooler Factory
export const getCoolerPrice = async () => {
  return new Promise(async (res, rej) => {
    const client = getClient();
    const coolerFactoryId = getCoolerFactoryId();

    const coolerFactory = await client.getObject({
      id: coolerFactoryId,
      // fetch the object content field
      options: { showContent: true },
    });

    // To Do: fix this any casting
    const response = coolerFactory?.data?.content;

    res(response?.fields?.fee);
  });
}
