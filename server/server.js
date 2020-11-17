import path from "path";
import { fileURLToPath } from "url";
import * as loaders from "./loaders/loaders.js";
import * as services from "./services/services.js";
import { promptConfirm } from "./scripts/promptScript.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("Starting process...");
const tyFlowUrl = "http://docs.tyflow.com/download/";

async function daemon() {
  let browserInstance = await loaders.loadBrowser();
  let pageInstance = await loaders.loadPage(browserInstance);

  if (await services.checkVersion(pageInstance, tyFlowUrl)) {
    // prompt things with inquirer.....
    if (await promptConfirm()) {
      // DL stuff
      console.log("CURRENT");
      let skipped = false;
      let cur_version = new_version;
    } else {
      console.log("SKIPPED");
      let skipped = true;
      let skipped_version = new_version;
    }
  }
}

daemon();

// promptConfirm().then((ret) => {
//   console.log(ret);
// });
