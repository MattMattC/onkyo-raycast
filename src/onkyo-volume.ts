import { showToast, Toast, LaunchProps } from "@raycast/api";

import OnkyoEiscp from "./onkyo-eiscp";
import { IP_ONKYO } from "./constants";

export default function Command(props: LaunchProps<{ arguments: Arguments.MyCommand }>) {
  const { volume } = props.arguments;

  (async () => {
    const receiver = new OnkyoEiscp(IP_ONKYO);

    try {
      await receiver.connect();

      receiver.setVolume(volume);

      setTimeout(() => receiver.disconnect(), 5000); // Déconnexion après 5 secondes
    } catch (error) {
      console.error("Erreur:", error);
      showToast({
        title: "Erreur",
        message: String(error),
        style: Toast.Style.Failure,
      });
    }
  })();

  showToast({
    title: "Volume set to " + volume,
    style: Toast.Style.Success,
  });
}
