import { LaunchProps } from "@raycast/api";
import { withOnkyo } from "./onkyo-client";

type VolumeArguments = {
  volume: string;
};

export default async function Command(props: LaunchProps<{ arguments: VolumeArguments }>) {
  const { volume } = props.arguments;

  await withOnkyo(
    (receiver) => {
      receiver.setVolume(volume);
    },
    { successTitle: "Volume réglé", successMessage: `${volume}%` },
  );
}
