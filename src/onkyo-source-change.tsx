import { Action, ActionPanel, Icon, List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { getOnkyoIp, withOnkyo } from "./onkyo-client";
import OnkyoEiscp from "./onkyo-eiscp";
import { ONKYO_SOURCES } from "./sources";

export default function Command() {
  const [currentSourceCode, setCurrentSourceCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentSource = async () => {
      const receiver = new OnkyoEiscp(getOnkyoIp());

      try {
        await receiver.connect();
        const sourceCode = await receiver.getCurrentSourceCode();
        setCurrentSourceCode(sourceCode);
      } catch {
        showToast({
          title: "Impossible de lire la source actuelle",
          style: Toast.Style.Failure,
        });
      } finally {
        receiver.disconnect();
        setIsLoading(false);
      }
    };

    loadCurrentSource();
  }, []);

  const selectSource = async (title: string, command: string) => {
    await withOnkyo(
      (receiver) => {
        receiver.setSource(command);
        setCurrentSourceCode(command.slice(3));
      },
      { successTitle: "Source changée", successMessage: title },
    );
  };

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Rechercher une source…">
      {ONKYO_SOURCES.map((source) => {
        const sourceCode = source.command.slice(3);
        const isActive = currentSourceCode === sourceCode;

        return (
          <List.Item
            key={source.id}
            title={source.title}
            subtitle={source.command}
            icon={isActive ? Icon.CheckCircle : Icon.Circle}
            accessories={isActive ? [{ text: "Actif", icon: Icon.SpeakerHigh }] : undefined}
            actions={
              <ActionPanel>
                <Action
                  title="Sélectionner"
                  icon={Icon.ArrowRight}
                  onAction={() => selectSource(source.title, source.command)}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
