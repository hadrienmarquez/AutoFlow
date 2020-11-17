import { EventEmitter } from "events";
import { tyflowArchive, tyflowDownload } from "../services/downloadService.js";
import env from "../config/index.js";
import { readData, writeData } from "../models/versionModelController.js";

class UpdateEmitter extends EventEmitter {
  constructor() {
    super();
    this.on("update", this.download);
    this.on("update", this.dbUpdate);
    this.on("skip", this.dbUpdate);
  }

  async download() {
    await tyflowArchive();
    await tyflowDownload();
  }

  async dbUpdate(skipped) {
    let cache;

    try {
      cache = await readData(`${env.workdir}/server/models/cache.json`);
    } catch (error) {
      console.log(`Couldn't access cache => ${error}`);
    }
    let data;
    if (skipped) {
      data = {
        current: { version: cache.current_version, skipped: true },
        skipped: { version: cache.new_version },
        cuda: { date: cache.new_cuda },
      };
    } else {
      data = {
        current: { version: cache.new_version, skipped: false },
        skipped: { version: cache.new_version },
        cuda: { date: cache.new_cuda },
      };
    }

    try {
      await writeData(data, "/usr/src/app/server/models/versions.json");
    } catch (error) {
      error;
    }
  }
}

export { UpdateEmitter };
