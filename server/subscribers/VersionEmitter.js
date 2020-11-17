import { EventEmitter } from "events";
import { sendEmail } from "../services/emailService.js";
import { writeData } from "../models/versionModelController.js";
import env from "../config/index.js";

class VersionEmitter extends EventEmitter {
  constructor() {
    super();
    this.on("new_version", this.email);
    this.on("new_version", this.caching);
  }

  email(data) {
    console.log("Sending email....");
    sendEmail(data);
  }

  caching(data) {
    let cache_path = `${env.workdir}/server/models/cache.json`;
    console.log("Caching version.......");
    writeData(data, cache_path);
  }
}

export { VersionEmitter };
