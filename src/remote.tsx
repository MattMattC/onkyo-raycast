import { ActionPanel, Action, List, showToast, Toast, Grid } from "@raycast/api";
import OnkyoEiscp from "./onkyo-eiscp";
import { IP_ONKYO } from "./constants";
import { useEffect, useState } from "react";

interface CommandItem {
  title: string;
  command: () => void;
}
let mounted = false;

const receiver = new OnkyoEiscp(IP_ONKYO);

export default function Command() {
  let currentVolume = 0;

  const [isPowerOnState, setIsPowerOnState] = useState(false);

  useEffect(() => {
    if (!mounted) {
      mounted = true;

      const connect = async () => {
        await receiver.connect();
        try {
          const isPowerOn = await receiver.isPowerOn();
          console.log("=> isPowerOn", isPowerOn);
          setIsPowerOnState(isPowerOn);
          showToast({
            title: "État",
            message: isPowerOn ? "Allumé" : "Éteint",
            style: Toast.Style.Success,
          });
        } catch (error) {
          showToast({
            title: "Erreur",
            message: "Éteint",
            style: Toast.Style.Failure,
          });
        }
        // await receiver.getVolume();
      };

      connect();
      console.log("=> lq");
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
      // await receiver.connect();
      // console.log("=> connecté");
      await command();

      showToast({
        title: "Commande envoyée",
        style: Toast.Style.Success,
      });

      // setTimeout(() => receiver.disconnect(), 5000);
    } catch (error) {
      console.error("Erreur:", error);
      showToast({
        title: "Erreur",
        message: String(error),
        style: Toast.Style.Failure,
      });
    }
  };
  console.log("=> yolo");

  return (
    <>
      <Grid>
        {commands.map((item, index) => (
          <Grid.Item
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
    </>
  );
}
