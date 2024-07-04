// Dependence
import 'dotenv/config';

// Packages imports
import inquirer from 'inquirer';

import config from "../../config.json" assert { type: "json" };

export const delay = ms => new Promise(res => setTimeout(res, ms));

export const getPacakgeId = () => {
  return config[config.network].packageId;
}

export const getCoolerFactoryId = () => {
  return config[config.network].coolerFactoryId;
}

// Ask questions in order to get the info need to create a Water Cooler
export const getWaterCoolerDetails = async () => {
  const prompt = inquirer.createPromptModule();
  const answers = await prompt([
    {
      type: "input",
      name: "name",
      message: `What is the name of your collection?`
    },
    {
      type: "input",
      name: "description",
      message: `How would you describe your collection?`
    },
    {
      type: "input",
      name: "supply",
      message: `How many NFTs will be in the collection?`
    },
    {
      type: "input",
      name: "treasury",
      message: `What address do you want to receive the mint proceeds to?`
    },
    {
      type: "input",
      name: "image_url",
      message: `Please provide a URL to an image you would like to use as your collection a cover image.`
    },
    {
      type: "input",
      name: "placeholder_image_url",
      message: `Please provide a URL to an image you would like to use as a placeholder image for your NFTs.`
    },
  ]);

  const confirmation = await confirmationPromt();

  if (confirmation == true) {
    return answers;
  } else {
    return getWaterCoolerDetails();
  }
}

const confirmationPromt = async () => {
  const prompt = inquirer.createPromptModule();
  const answers = await prompt([
    {
      type: "input",
      name: "confirm",
      message: `Are you happy with your setting?. To confirm type y or n to restart:`
    }
  ]);

  if(answers.confirm == "y") {
    return true;
  } else if(answers.confirm == "n") {
    return false;
  } else {
    return undefined;
  }
}