import * as loaders from "./loaders/loaders.js";
import * as services from "./services/services.js";
import { promptConfirm } from "./scripts/promptScript.js";
import { UpdateEmitter } from "./subscribers/UpdateEmitter.js";
import env from "./config/index.js";

const tyFlowUrl = "http://docs.tyflow.com/download/";
const updateEmitter = new UpdateEmitter();

async function daemon() {
  let browserInstance = await loaders.loadBrowser();
  let pageInstance = await loaders.loadPage(browserInstance);

  if (await services.checkVersion(pageInstance, tyFlowUrl)) {
    if (await promptConfirm()) {
      console.log("CURRENT - Starting archive & downloads.....");
      updateEmitter.emit("update", false);
    } else {
      console.log("SKIPPED - Only updating database");
      updateEmitter.emit("skip", true);
    }
  }
}

console.log("Starting process...");

daemon();
