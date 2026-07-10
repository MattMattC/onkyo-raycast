export const OnkyoCommands = {
  POWER: {
    ON: "PWR01",
    OFF: "PWR00",
    QUERY: "PWRQSTN",
  },
  VOLUME: {
    UP: "MVLUP",
    DOWN: "MVLDOWN",
    QUERY: "MVLQSTN",
    SET: (level: string) => `MVL${level}`,
  },
  SOURCE: {
    QUERY: "SLIQSTN",
  },
  AUDIO: {
    MUTE_ON: "AMT01",
    MUTE_OFF: "AMT00",
    MUTE_TOGGLE: "AMTTG",
    MUTE_QUERY: "AMTQSTN",
  },
} as const;
