import { showToast, Toast } from "@raycast/api";
import OnkyoEISCP from "./onkyo-eiscp";
import { IP_ONKYO } from "./constants";

export default async function Command() {
  try {
    const receiver = new OnkyoEISCP(IP_ONKYO);
    await receiver.connect();
    receiver.sendCommand("MUTE00");

    showToast({
      title: "Ampli mis en sourdine",
      style: Toast.Style.Success,
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));
    await receiver.disconnect();
  } catch (error) {
    console.log("=> error", error);
    showToast({
      title: "Erreur",
      message: String(error),
      style: Toast.Style.Failure,
    });
  }
}
