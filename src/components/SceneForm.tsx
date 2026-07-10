import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useState } from "react";
import { upsertScene } from "../scene-storage";
import { formValuesToScene, OnkyoScene, sceneToFormValues } from "../scene-types";
import { ONKYO_SOURCES } from "../sources";

type SceneFormProps = {
  scene?: OnkyoScene;
  onSave: () => void;
};

export function SceneForm({ scene, onSave }: SceneFormProps) {
  const { pop } = useNavigation();
  const [error, setError] = useState<string>();

  const handleSubmit = async (values: ReturnType<typeof sceneToFormValues>) => {
    try {
      setError(undefined);
      const nextScene = formValuesToScene(values, scene?.id);
      await upsertScene(nextScene);
      onSave();
      pop();
    } catch (submitError) {
      setError(String(submitError));
    }
  };

  return (
    <Form
      navigationTitle={scene ? "Modifier la scène" : "Nouvelle scène"}
      actions={
        <ActionPanel>
          <Action.SubmitForm title={scene ? "Enregistrer" : "Créer"} icon={Icon.Check} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Nom" placeholder="Mode musique" defaultValue={scene?.name} />

      <Form.Dropdown id="power" title="Alimentation" defaultValue={scene?.power ?? "none"}>
        <Form.Dropdown.Item value="none" title="Ne pas changer" />
        <Form.Dropdown.Item value="on" title="Allumer" />
        <Form.Dropdown.Item value="off" title="Éteindre" />
      </Form.Dropdown>

      <Form.Dropdown id="sourceId" title="Source" defaultValue={scene?.sourceId ?? ""}>
        <Form.Dropdown.Item value="" title="Ne pas changer" />
        {ONKYO_SOURCES.map((source) => (
          <Form.Dropdown.Item key={source.id} value={source.id} title={source.title} />
        ))}
      </Form.Dropdown>

      <Form.TextField
        id="volume"
        title="Volume"
        placeholder="40"
        info="Entre 0 et 100. Laisse vide pour ne pas changer."
        defaultValue={scene?.volume !== undefined ? String(scene.volume) : ""}
      />

      <Form.Dropdown id="mute" title="Sourdine" defaultValue={scene?.mute ?? "none"}>
        <Form.Dropdown.Item value="none" title="Ne pas changer" />
        <Form.Dropdown.Item value="mute" title="Couper le son" />
        <Form.Dropdown.Item value="unmute" title="Remettre le son" />
      </Form.Dropdown>

      {error ? <Form.Description title="Erreur" text={error} /> : null}
    </Form>
  );
}
