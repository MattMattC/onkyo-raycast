import { LocalStorage } from "@raycast/api";
import { OnkyoScene } from "./scene-types";

const STORAGE_KEY = "onkyo-scenes";

function getDefaultScenes(): OnkyoScene[] {
  return [
    {
      id: "default-music-mode",
      name: "Mode musique",
      power: "on",
      sourceId: "cbl_sat",
      volume: 40,
    },
  ];
}

export async function getScenes(): Promise<OnkyoScene[]> {
  const stored = await LocalStorage.getItem<string>(STORAGE_KEY);

  if (!stored) {
    const defaults = getDefaultScenes();
    await saveScenes(defaults);
    return defaults;
  }

  return JSON.parse(stored) as OnkyoScene[];
}

export async function saveScenes(scenes: OnkyoScene[]): Promise<void> {
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
}

export async function upsertScene(scene: OnkyoScene): Promise<OnkyoScene[]> {
  const scenes = await getScenes();
  const index = scenes.findIndex((item) => item.id === scene.id);
  const nextScenes = [...scenes];

  if (index >= 0) {
    nextScenes[index] = scene;
  } else {
    nextScenes.push(scene);
  }

  await saveScenes(nextScenes);
  return nextScenes;
}

export async function deleteScene(sceneId: string): Promise<OnkyoScene[]> {
  const scenes = (await getScenes()).filter((scene) => scene.id !== sceneId);
  await saveScenes(scenes);
  return scenes;
}

export async function findSceneByName(name: string): Promise<OnkyoScene | undefined> {
  const normalized = name.trim().toLowerCase();
  return (await getScenes()).find((scene) => scene.name.toLowerCase() === normalized);
}
