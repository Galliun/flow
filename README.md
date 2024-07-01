# Flow

A command-line tool to facilitate the Interaction with the [Water Cooler Protocol](https://github.com/VisionDeCreator/water_cooler "Water Cooler Protocol") and creation of NFT collection on the Sui blockchain.

## How does it work
Using Flow you will be able to buy a Water Cooler which functions as an NFT loading and distribution program for creators.

You will also be able to configure your mint setting like mint price, and mint start time.

In the future we will also support white list distribution and on chain image upload.

## Dependencies
Flow Node.js version 18.


## CLI guild
Flow allows you to manage the whole lifecycle of a Water cooler and has the following advantages over bespoke structure:
- Prebuilt NFT that matches a generalised industry structure
- Less development knowledge is required in order to publish an NFT collection
- robust error handling and validation of inputs

Setting up Flow is as simple as opening your terminal cloning a git repo and installing an npm package.
```shell
git clone [repo link]
cd flow
npm i
npm i -g
```

Add the seed phrase of the wallet you want to use as the Water Cooler manager in the .env file. Use the .env.dev file as a reference.
```
mv .env.example .env
```

Update .env file
```
SEED_PHRASE="<your_phrase_here>"
```

Flow contains a collection of commands for buying and managing a Water Cooler. The complete list of commands can be viewed by running on your command line:
```shell
flow
```
This will display a list of commands and a their short description:
```shell
Usage: flow [options] [command]

Options:
  -V, --version      output the version number
  -h, --help         display help for command

Commands:
  network            Gives information on the sui network
  switch <string>    Switch connected Sui network to dev or main network
  balance            Get connected wallet balance
  faucet             Request Sui from network faucet
  price              Get Water Cooler price from the Cooler factory
  buy                Buy a Water Cooler from the Cooler factory
  init               Initiate Water Cooler for mint
  mint               Mint NFT from deployed Water Cooler
  setting [options]  Change setting on your Water Cooler
  help [command]     display help for command
```

To get more information about a particular command (e.g., "switch), use the help command:
```shell
flow help switch
```

This will display a list of options together with a short description:

```shell
Usage: flow switch [options] <string>

Switch connected Sui network to dev or main network

Arguments:
  string      the network you want to switch to.

Options:
  -h, --help  display help for command
```

## Walk through
First you buy a Water Cooler using the following command:
```
flow buy
```
Then you enter the details of your NFT collection. Once the buy process is complete you then initilise the minting structure.

```
flow init
```

Then you stock the Water cooler. This adds the base NFT that were created into the minting structure.

```
flow stock
```

You can then use the settings command to make changes to things like the name on the collection, mint price, mint phase.
```
flow setting [options]
```

And then you are ready to go. Use the mint command to mint your first NFT.
```
flow mint
```