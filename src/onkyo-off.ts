import { withOnkyo } from "./onkyo-client";

export default async function Command() {
  await withOnkyo(
    (receiver) => {
      receiver.powerOff();
    },
    { successTitle: "Ampli éteint" },
  );
}
