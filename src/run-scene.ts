import { LaunchProps, showToast, Toast } from "@raycast/api";
import { executeScene } from "./scene-runner";
import { findSceneByName } from "./scene-storage";

type RunSceneArguments = {
  scene: string;
};

export default async function Command(props: LaunchProps<{ arguments: RunSceneArguments }>) {
  const sceneName = props.arguments.scene.trim();

  if (!sceneName) {
    showToast({
      title: "Nom de scène requis",
      style: Toast.Style.Failure,
    });
    return;
  }

  const scene = await findSceneByName(sceneName);

  if (!scene) {
    showToast({
      title: "Scène introuvable",
      message: sceneName,
      style: Toast.Style.Failure,
    });
    return;
  }

  await executeScene(scene);
}
