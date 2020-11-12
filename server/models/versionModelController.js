import { promises as fs } from "fs";

let file_path = "/usr/src/app/server/models/versions.json";

async function readCurVersion() {
  let rawData;
  try {
    rawData = await fs.readFile(file_path);
    console.log(`Reading  from database.....`);
  } catch (error) {
    console.log(`Couldn't read from database => ${error}`);
  }

  try {
    let jsonData = JSON.parse(rawData);
    console.log(`Raw data parsed into JSON.......`);
    return jsonData;
  } catch (error) {
    console.log(`Couldn't parse data into JSON => ${error}`);
  }
}

async function writeCurVersion(data) {
  let rawData;
  try {
    rawData = JSON.stringify(data);
    console.log(`JSON to string converted......`);
  } catch (error) {
    console.log(`Couldn't convert JSONT to string => ${error}`);
  }

  try {
    console.log(`Updating TyFlow version in database .....`);
    await fs.writeFile(file_path, rawData);
    console.log(`Updated`);
  } catch (error) {
    console.log(`Couldn't update data => ${error}`);
  }
}

export { readCurVersion, writeCurVersion };
