export const OnkyoCommands = {
  // Commandes d'alimentation
  POWER: {
    ON: "PWR01",
    OFF: "PWR00",
    QUERY: "PWRQSTN",
  },

  // Commandes de volume
  VOLUME: {
    UP: "MVLUP",
    DOWN: "MVLDOWN",
    QUERY: "MVLQSTN",
    SET: (level: string) => `MVL${level}`, // Utilisé avec setVolume()
  },

  // Commandes de source
  SOURCE: {
    CD: "SLI23",
    TV: "SLI12",
    GAME: "SLI02",
    AUX: "SLI03",
    BLUETOOTH: "SLI2A",
    QUERY: "SLIQSTN",
  },

  // Commandes de son
  AUDIO: {
    MUTE_ON: "AMT01",
    MUTE_OFF: "AMT00",
    MUTE_TOGGLE: "AMTTG",
    MUTE_QUERY: "AMTQSTN",
  },
};

export type CommandCategory = keyof typeof OnkyoCommands;
export type Command<T extends CommandCategory> = keyof (typeof OnkyoCommands)[T];
