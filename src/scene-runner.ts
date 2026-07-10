import { withOnkyo } from "./onkyo-client";
import OnkyoEiscp from "./onkyo-eiscp";
import { describeScene, OnkyoScene } from "./scene-types";
import { findSourceById } from "./sources";

const POWER_ON_DELAY_MS = 2500;
const COMMAND_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSceneActions(receiver: OnkyoEiscp, scene: OnkyoScene): Promise<void> {
  if (scene.power === "on") {
    receiver.powerOn();

    if (scene.sourceId || scene.volume !== undefined || scene.mute) {
      await delay(POWER_ON_DELAY_MS);
    }
  }

  if (scene.power === "off") {
    receiver.powerOff();
    return;
  }

  if (scene.sourceId) {
    const source = findSourceById(scene.sourceId);
    if (!source) {
      throw new Error(`Source inconnue : ${scene.sourceId}`);
    }

    receiver.setSource(source.command);
    await delay(COMMAND_DELAY_MS);
  }

  if (scene.volume !== undefined) {
    receiver.setVolume(scene.volume);
    await delay(COMMAND_DELAY_MS);
  }

  if (scene.mute === "mute") {
    receiver.mute();
  }

  if (scene.mute === "unmute") {
    receiver.unmute();
  }
}

export async function executeScene(scene: OnkyoScene): Promise<void> {
  await withOnkyo(
    async (receiver) => {
      await runSceneActions(receiver, scene);
    },
    {
      successTitle: scene.name,
      successMessage: describeScene(scene),
    },
  );
}
