export type OnkyoSource = {
  id: string;
  title: string;
  command: string;
};

/** Input sources from Onkyo EISCP SLI command (command.json reference). */
export const ONKYO_SOURCES: OnkyoSource[] = [
  { id: "video1", title: "VIDEO1 / VCR / DVR", command: "SLI00" },
  { id: "cbl_sat", title: "CBL/SAT / VIDEO2", command: "SLI01" },
  { id: "game", title: "GAME / TV / VIDEO3", command: "SLI02" },
  { id: "aux1", title: "AUX1 / VIDEO4", command: "SLI03" },
  { id: "aux2", title: "AUX2 / VIDEO5", command: "SLI04" },
  { id: "pc", title: "PC / VIDEO6", command: "SLI05" },
  { id: "video7", title: "VIDEO7", command: "SLI06" },
  { id: "bd_dvd", title: "BD/DVD", command: "SLI10" },
  { id: "tape", title: "TAPE / TV-TAPE", command: "SLI20" },
  { id: "tape2", title: "TAPE2", command: "SLI21" },
  { id: "phono", title: "PHONO", command: "SLI22" },
  { id: "cd", title: "CD", command: "SLI23" },
  { id: "fm", title: "FM", command: "SLI24" },
  { id: "am", title: "AM", command: "SLI25" },
  { id: "tuner", title: "TUNER", command: "SLI26" },
  { id: "music_server", title: "MUSIC SERVER / DLNA", command: "SLI27" },
  { id: "internet_radio", title: "INTERNET RADIO", command: "SLI28" },
  { id: "usb_front", title: "USB (Front)", command: "SLI29" },
  { id: "multi_ch", title: "MULTI CH", command: "SLI30" },
  { id: "xm", title: "XM", command: "SLI31" },
  { id: "sirius", title: "SIRIUS", command: "SLI32" },
  { id: "universal_port", title: "Universal PORT", command: "SLI40" },
  { id: "usb_rear", title: "USB (Rear)", command: "SLI2A" },
  { id: "network", title: "NETWORK / NET", command: "SLI2B" },
  { id: "usb", title: "USB", command: "SLI2C" },
];

export function findSourceById(id: string): OnkyoSource | undefined {
  return ONKYO_SOURCES.find((source) => source.id === id);
}
