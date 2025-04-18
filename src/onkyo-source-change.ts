import { showToast, Toast, LaunchProps } from "@raycast/api";

import OnkyoEiscp from "./onkyo-eiscp";
import { IP_ONKYO } from "./constants";

export default function Command(props: LaunchProps<{ arguments: Arguments.MyCommand }>) {
  const { source } = props.arguments;

  (async () => {
    const receiver = new OnkyoEiscp(IP_ONKYO);

    try {
      await receiver.connect();
      const sources = await receiver.getSources();
      console.log("sources", sources);
      receiver.setSource(source);

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
    title: "Source set to " + source,
    style: Toast.Style.Success,
  });
}


// 
// AUX

// type": "dropdown",
          // "data": [
          //   {
          //     "title": "CD",
          //     "value": "CD"
          //   },
          //   {
          //     "title": "GAME",
          //     "value": "GAME"
          //   },
          //   {
          //     "title": "TV",
          //     "value": "TV/CD"
          //   },
          //   {
          //     "title": "CBL/01",
          //     "value": "SAT"
          //   },
          //   {
          //     "title": "CBL/02",
          //     "value": "CBL/02"
          //   },
          //   {
          //     "title": "BD/DVD",
          //     "value": "BD"
          //   }
          // ]