import { showToast, Toast } from "@raycast/api";

import OnkyoEiscp from "./onkyo-eiscp";

const IP_ONKYO = "192.168.1.54"; // Remplace par l'IP de ton ampli
const PORT = "60128";

export default async function Command() {
  const receiver = new OnkyoEiscp(IP_ONKYO);
  console.log("=> receiver ", receiver);

  try {
    await receiver.connect();

    // Éteindre l'ampli
    await receiver.sendCommand("PWR00");

    showToast({
      title: "Ampli mis hors tension",
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
