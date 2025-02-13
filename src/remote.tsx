import { ActionPanel, Action, List, showToast, Toast, Grid } from "@raycast/api";
import OnkyoEiscp from "./onkyo-eiscp";
import { IP_ONKYO } from "./constants";
import { useEffect } from "react";

interface CommandItem {
  title: string;
  command: () => void;
}
let mounted = false;

export default function Command() {
  const receiver = new OnkyoEiscp(IP_ONKYO);
  let currentVolume = 0;

  useEffect(() => {
    if (!mounted) {
      mounted = true;

      console.log("=> useEffect");
      const isConnected = receiver.isConnected();
      console.log("=> ", isConnected);
      receiver.getVolume().then((response) => {
        console.log("=> ", response);
      });
    }

    return () => {};
  }, []);

  const commands: CommandItem[] = [
    {
      title: "Allumer",
      command: () => receiver.powerOn(),
    },
    {
      title: "Éteindre",
      command: () => receiver.powerOff(),
    },
    {
      title: "Couper le son",
      command: () => receiver.mute(),
    },
    {
      title: "Remettre le son",
      command: () => receiver.unmute(),
    },
    {
      title: "Volume +",
      command: () => {
        currentVolume = Math.min(currentVolume + 5, 100);
        receiver.setVolume(currentVolume);
      },
    },
    {
      title: "Volume -",
      command: () => {
        currentVolume = Math.max(currentVolume - 5, 0);
        receiver.setVolume(currentVolume);
      },
    },
  ];

  const handleAction = async (command: () => void) => {
    try {
      await receiver.connect();
      command();

      showToast({
        title: "Commande envoyée",
        style: Toast.Style.Success,
      });

      setTimeout(() => receiver.disconnect(), 5000);
    } catch (error) {
      console.error("Erreur:", error);
      showToast({
        title: "Erreur",
        message: String(error),
        style: Toast.Style.Failure,
      });
    }
  };

  return (
    <Grid>
      {commands.map((item, index) => (
        <Grid
          key={index}
          title={item.title}
          subtitle={item.title.includes("Volume") ? `Volume actuel: ${currentVolume}%` : ""}
          content={item.title}
          actions={
            <ActionPanel>
              <Action title={item.title} onAction={() => handleAction(item.command)} />
            </ActionPanel>
          }
        />
      ))}
    </Grid>
  );
}
