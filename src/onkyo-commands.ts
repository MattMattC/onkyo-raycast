export const OnkyoCommands = {
  // power commands
  POWER: {
    ON: "PWR01",
    OFF: "PWR00",
    QUERY: "PWRQSTN",
  },

  // volume commands
  VOLUME: {
    UP: "MVLUP",
    DOWN: "MVLDOWN",
    QUERY: "MVLQSTN",
    SET: (level: string) => `MVL${level}`, // used with setVolume()
  },

  // source commands
  // see @file src/commands.json
  SOURCE: {
    CD: "SLI23",
    TV: "SLI23",
    GAME: "SLI02",
    AUX: "SLI03",
    BD_DVD: "SLI10",
    CBL_SAT: "SLI01",
    QUERY: "SLIQSTN",
  },

  // audio commands
  AUDIO: {
    MUTE_ON: "AMT01",
    MUTE_OFF: "AMT00",
    MUTE_TOGGLE: "AMTTG",
    MUTE_QUERY: "AMTQSTN",
  },
};

export type CommandCategory = keyof typeof OnkyoCommands;
export type Command<T extends CommandCategory> = keyof (typeof OnkyoCommands)[T];
