import { showToast, Toast } from "@raycast/api";

import OnkyoEiscp from "./onkyo-eiscp";
import { IP_ONKYO } from "./constants";
import { OnkyoCommands } from "./onkyo-commands";

export default async function Command() {
  const receiver = new OnkyoEiscp(IP_ONKYO);

  try {
    await receiver.connect();

    // Éteindre l'ampli
    receiver.sendCommand(OnkyoCommands.POWER.ON);

    showToast({
      title: "Ampli mis en tension",
      style: Toast.Style.Success,
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));
    await receiver.disconnect();
  } catch (error) {
    console.error("Erreur:", error);
    showToast({
      title: "Erreur",
      message: String(error),
      style: Toast.Style.Failure,
    });
  }
}
