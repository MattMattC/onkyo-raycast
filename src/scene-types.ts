import { randomUUID } from "crypto";
import { findSourceById } from "./sources";

export type ScenePower = "on" | "off";
export type SceneMute = "mute" | "unmute";

export type OnkyoScene = {
  id: string;
  name: string;
  power?: ScenePower;
  sourceId?: string;
  volume?: number;
  mute?: SceneMute;
};

export type SceneFormValues = {
  name: string;
  power: "none" | ScenePower;
  sourceId: string;
  volume: string;
  mute: "none" | SceneMute;
};

export function describeScene(scene: OnkyoScene): string {
  const parts: string[] = [];

  if (scene.power === "on") {
    parts.push("Allumer");
  }
  if (scene.power === "off") {
    parts.push("Éteindre");
  }
  if (scene.sourceId) {
    const source = findSourceById(scene.sourceId);
    parts.push(source?.title ?? scene.sourceId);
  }
  if (scene.volume !== undefined) {
    parts.push(`Volume ${scene.volume}`);
  }
  if (scene.mute === "mute") {
    parts.push("Mute");
  }
  if (scene.mute === "unmute") {
    parts.push("Unmute");
  }

  return parts.length > 0 ? parts.join(" · ") : "Aucune action";
}

export function sceneToFormValues(scene: OnkyoScene): SceneFormValues {
  return {
    name: scene.name,
    power: scene.power ?? "none",
    sourceId: scene.sourceId ?? "",
    volume: scene.volume !== undefined ? String(scene.volume) : "",
    mute: scene.mute ?? "none",
  };
}

export function formValuesToScene(values: SceneFormValues, id?: string): OnkyoScene {
  if (!values.name.trim()) {
    throw new Error("Le nom est obligatoire.");
  }

  const volume = values.volume.trim();
  const parsedVolume = volume === "" ? undefined : Number.parseInt(volume, 10);

  if (parsedVolume !== undefined && (Number.isNaN(parsedVolume) || parsedVolume < 0 || parsedVolume > 100)) {
    throw new Error("Le volume doit être entre 0 et 100.");
  }

  const scene: OnkyoScene = {
    id: id ?? randomUUID(),
    name: values.name.trim(),
  };

  if (values.power !== "none") {
    scene.power = values.power;
  }
  if (values.sourceId) {
    scene.sourceId = values.sourceId;
  }
  if (parsedVolume !== undefined) {
    scene.volume = parsedVolume;
  }
  if (values.mute !== "none") {
    scene.mute = values.mute;
  }

  if (!scene.power && !scene.sourceId && scene.volume === undefined && !scene.mute) {
    throw new Error("Ajoute au moins une action à la scène.");
  }

  return scene;
}
