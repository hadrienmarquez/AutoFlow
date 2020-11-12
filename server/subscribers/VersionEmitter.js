import { EventEmitter } from "events";
import { sendEmail } from "../services/emailService.js";

class VersionEmitter extends EventEmitter {
  constructor() {
    super();
    this.on("new_version", this.email);
  }

  email(data) {
    console.log("Sending email....");
    sendEmail(data);
  }
}

export { VersionEmitter };
