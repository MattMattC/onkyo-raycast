import { Action, ActionPanel, Icon, List, showToast, Toast } from "@raycast/api";
import { useCallback, useEffect, useState } from "react";
import { getOnkyoIp, withOnkyo } from "./onkyo-client";
import OnkyoEiscp from "./onkyo-eiscp";
import { executeScene } from "./scene-runner";
import { getScenes } from "./scene-storage";
import { describeScene, OnkyoScene } from "./scene-types";
import { ONKYO_SOURCES } from "./sources";

export default function Command() {
  const [isPowerOn, setIsPowerOn] = useState<boolean | null>(null);
  const [currentSourceCode, setCurrentSourceCode] = useState<string | null>(null);
  const [scenes, setScenes] = useState<OnkyoScene[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadState = useCallback(async () => {
    setIsLoading(true);

    const receiver = new OnkyoEiscp(getOnkyoIp());

    try {
      await receiver.connect();
      const [powerOn, sourceCode] = await Promise.all([receiver.isPowerOn(), receiver.getCurrentSourceCode()]);
      setIsPowerOn(powerOn);
      setCurrentSourceCode(sourceCode);
    } catch {
      showToast({
        title: "Impossible de joindre l'ampli",
        style: Toast.Style.Failure,
      });
    } finally {
      receiver.disconnect();
    }

    setScenes(await getScenes());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const runAction = async (title: string, action: (receiver: OnkyoEiscp) => void) => {
    await withOnkyo(action, { successTitle: title });
  };

  const activeSource = ONKYO_SOURCES.find((source) => source.command.slice(3) === currentSourceCode);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Rechercher une action…"
      navigationTitle={isPowerOn === null ? "Onkyo Remote" : isPowerOn ? "Onkyo — Allumé" : "Onkyo — Éteint"}
    >
      <List.Section title="Alimentation">
        <List.Item
          title="Allumer"
          icon={Icon.Power}
          actions={
            <ActionPanel>
              <Action title="Allumer" onAction={() => runAction("Ampli allumé", (r) => r.powerOn())} />
            </ActionPanel>
          }
        />
        <List.Item
          title="Éteindre"
          icon={Icon.Switch}
          actions={
            <ActionPanel>
              <Action title="Éteindre" onAction={() => runAction("Ampli éteint", (r) => r.powerOff())} />
            </ActionPanel>
          }
        />
      </List.Section>

      <List.Section title="Volume">
        <List.Item
          title="Volume +"
          icon={Icon.Plus}
          actions={
            <ActionPanel>
              <Action title="Volume +" onAction={() => runAction("Volume augmenté", (r) => r.adjustVolume(1))} />
            </ActionPanel>
          }
        />
        <List.Item
          title="Volume −"
          icon={Icon.Minus}
          actions={
            <ActionPanel>
              <Action title="Volume −" onAction={() => runAction("Volume diminué", (r) => r.adjustVolume(-1))} />
            </ActionPanel>
          }
        />
        <List.Item
          title="Couper le son"
          icon={Icon.SpeakerOff}
          actions={
            <ActionPanel>
              <Action title="Mute" onAction={() => runAction("Son coupé", (r) => r.mute())} />
            </ActionPanel>
          }
        />
        <List.Item
          title="Remettre le son"
          icon={Icon.SpeakerHigh}
          actions={
            <ActionPanel>
              <Action title="Unmute" onAction={() => runAction("Son réactivé", (r) => r.unmute())} />
            </ActionPanel>
          }
        />
      </List.Section>

      <List.Section
        title="Sources"
        subtitle={
          activeSource
            ? `Actif : ${activeSource.title}`
            : currentSourceCode
              ? `Code : SLI${currentSourceCode}`
              : undefined
        }
      >
        {ONKYO_SOURCES.map((source) => {
          const sourceCode = source.command.slice(3);
          const isActive = currentSourceCode === sourceCode;

          return (
            <List.Item
              key={source.id}
              title={source.title}
              icon={isActive ? Icon.CheckCircle : Icon.Circle}
              accessories={isActive ? [{ text: "Actif" }] : undefined}
              actions={
                <ActionPanel>
                  <Action
                    title="Sélectionner"
                    onAction={() =>
                      runAction(`Source : ${source.title}`, (receiver) => {
                        receiver.setSource(source.command);
                        setCurrentSourceCode(sourceCode);
                      })
                    }
                  />
                </ActionPanel>
              }
            />
          );
        })}
      </List.Section>

      <List.Section title="Scènes">
        {scenes.map((scene) => (
          <List.Item
            key={scene.id}
            title={scene.name}
            subtitle={describeScene(scene)}
            icon={Icon.Layers}
            actions={
              <ActionPanel>
                <Action title="Activer La Scène" icon={Icon.Play} onAction={() => executeScene(scene)} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
