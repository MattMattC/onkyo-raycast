import { withOnkyo } from "./onkyo-client";

export default async function Command() {
  await withOnkyo(
    (receiver) => {
      receiver.mute();
    },
    { successTitle: "Son coupé" },
  );
}
