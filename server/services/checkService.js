import { readData } from "../models/versionModelController.js";
import { VersionEmitter } from "../subscribers/VersionEmitter.js";
import dayjs from "dayjs";

const versionEmitter = new VersionEmitter();
let db_path = "/usr/src/app/server/models/versions.json";

async function getVersionTyflow(pageInstance, url) {
  let page;
  try {
    page = await pageInstance;
  } catch (error) {
    console.log(`Couldn't resolve the page => ${error}`);
  }

  try {
    console.log(`Navigating to ${url} .......`);
    await page.goto(url);
  } catch (error) {
    console.log(`Couldn't open ${url} => ${error}`);
  }

  let new_version;
  //   Getting the version by parsing button.value
  try {
    console.log(`Getting new version of TyFlow.......`);
    new_version = await page.$eval(
      "#body-inner > form:nth-child(5) > p:nth-child(3) > button:nth-child(1)",
      (el) => el.value.split("_")[1]
    );
  } catch (error) {
    console.log(`Couldn't get version of TyFlow =>  ${error}`);
  }

  return new_version;
}

async function getVersionCuda(pageInstance, url) {
  let page;
  try {
    page = await pageInstance;
  } catch (error) {
    console.log(`Couldn't resolve the page => ${error}`);
  }

  try {
    console.log(`Navigating to ${url} .......`);
    await page.goto(url);
  } catch (error) {
    console.log(`Couldn't open ${url} => ${error}`);
  }

  let cuda_version;
  //   Getting the version by parsing button.value
  try {
    console.log(`Getting new version of Cuda.......`);
    cuda_version = await page.$eval(
      "#body-inner > form:nth-child(7) > p:nth-child(1) > button:nth-child(1) > i:nth-child(1)",
      (el) => el.textContent.slice(1, -1)
    );
  } catch (error) {
    console.log(`Couldn't get version of Cuda =>  ${error}`);
  }

  return dayjs(cuda_version, "MMMM DD YYYY").format("MM-DD-YYYY");
}

async function checkVersion(pageInstance, url) {
  let new_version, cuda_version;

  try {
    new_version = await getVersionTyflow(pageInstance, url);
    console.log(`New version of TyFlow: ${new_version}......`);
  } catch (error) {
    console.log(`Error => ${error}`);
  }

  try {
    cuda_version = await getVersionCuda(pageInstance, url);
    console.log(`New version of CUDA: ${cuda_version}......`);
  } catch (error) {
    console.log(`Error => ${error}`);
  }

  let data = await readData(db_path);

  // Check TyFlow
  if (new_version != data.current.version && !data.current.skipped) {
    console.log("Current: New version available, emitting signal....");
    // Emit signal
    versionEmitter.emit("new_version", {
      new_version: new_version,
      current_version: data.current.version,
      new_cuda: cuda_version,
      current_cuda: data.cuda.date,
    });
    return true;
  } else if (data.current.skipped && new_version != data.skipped.version) {
    console.log("Skipped: New version available, emitting signal....");
    // Emit signal
    versionEmitter.emit("new_version", {
      new_version: new_version,
      current_version: data.current.version,
      new_cuda: cuda_version,
      current_cuda: data.cuda.date,
    });
    return true;
  } else {
    console.clear();
    console.log("No new version available! Return to sleep....");
    return false;
  }
}

export { checkVersion, getVersionCuda };
