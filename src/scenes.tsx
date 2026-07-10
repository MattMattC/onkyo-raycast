import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api";
import { useCallback, useEffect, useState } from "react";
import { SceneForm } from "./components/SceneForm";
import { executeScene } from "./scene-runner";
import { deleteScene, getScenes } from "./scene-storage";
import { describeScene, OnkyoScene } from "./scene-types";

export default function Command() {
  const { push } = useNavigation();
  const [scenes, setScenes] = useState<OnkyoScene[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reloadScenes = useCallback(async () => {
    setScenes(await getScenes());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    reloadScenes();
  }, [reloadScenes]);

  const openCreateForm = () => {
    push(<SceneForm onSave={reloadScenes} />);
  };

  const openEditForm = (scene: OnkyoScene) => {
    push(<SceneForm scene={scene} onSave={reloadScenes} />);
  };

  const removeScene = async (scene: OnkyoScene) => {
    setScenes(await deleteScene(scene.id));
  };

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Rechercher une scène…">
      <List.EmptyView
        title="Aucune scène"
        description="Crée des scènes pour enchaîner allumage, source et volume en un clic."
        actions={
          <ActionPanel>
            <Action title="Créer Une Scène" icon={Icon.Plus} onAction={openCreateForm} />
          </ActionPanel>
        }
      />

      {scenes.map((scene) => (
        <List.Item
          key={scene.id}
          title={scene.name}
          subtitle={describeScene(scene)}
          icon={Icon.Layers}
          actions={
            <ActionPanel>
              <Action title="Activer La Scène" icon={Icon.Play} onAction={() => executeScene(scene)} />
              <Action title="Modifier" icon={Icon.Pencil} onAction={() => openEditForm(scene)} />
              <Action
                title="Supprimer"
                icon={Icon.Trash}
                style={Action.Style.Destructive}
                onAction={() => removeScene(scene)}
              />
            </ActionPanel>
          }
        />
      ))}

      <List.Item
        title="Créer une scène"
        icon={Icon.Plus}
        actions={
          <ActionPanel>
            <Action title="Créer Une Scène" icon={Icon.Plus} onAction={openCreateForm} />
          </ActionPanel>
        }
      />
    </List>
  );
}
