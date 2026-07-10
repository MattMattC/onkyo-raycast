import { withOnkyo } from "./onkyo-client";

export default async function Command() {
  await withOnkyo(
    (receiver) => {
      receiver.powerOn();
    },
    { successTitle: "Ampli allumé" },
  );
}
