import chalk from "chalk";
export function isCollectionFilled(collectionTest: {name?: string,
    description?: string,
    supply?: number,
    treasury?: string,
    image_url?: string,
    placeholder_image_url?: string}
) {
    if(!collectionTest.name || !collectionTest.description || !collectionTest.supply || !collectionTest.treasury || !collectionTest.image_url || !collectionTest.placeholder_image_url) {
        console.error(`${chalk.red.bold("[Error]")} Please fill in all fields in the collection.json file to continue working`)
        process.exit(1) // to stop code
    }
    return true;
}