import net from "net";
import { OnkyoCommands } from "./onkyo-commands";

const EISCP_PORT = 60128;

type OnkyoResponse = {
  command: string;
  value: string;
};

class OnkyoEiscp {
  private host: string;
  private port: number;
  private client: net.Socket;

  constructor(host: string, port: number = EISCP_PORT) {
    this.host = host;
    this.port = port;
    this.client = new net.Socket();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.connect(this.port, this.host, () => {
        console.log("✅ Connected to Onkyo receiver");
        resolve();
      });

      this.client.on("data", (data) => {
        const response = this.parseResponse(data);
        console.log("📥 Parsed response:", response);
      });

      this.client.on("error", (err) => {
        console.error("❌ Connection error:", err);
        reject(err);
      });

      this.client.on("close", () => {
        console.log("🔌 Connection closed");
      });
    });
  }

  sendCommand(command: string): void {
    const message = this.buildEiscpMessage(command);
    this.client.write(message);
    console.log(`📤 Command sent: ${command}`);
  }

  disconnect(): void {
    this.client.end();
    console.log("🔌 Disconnected from Onkyo receiver");
  }

  private buildEiscpMessage(command: string): Buffer {
    const cmd = `!1${command}\r`;
    const cmdBuffer = Buffer.from(cmd, "ascii");

    const eiscpHeader = Buffer.from([
      0x49,
      0x53,
      0x43,
      0x50, // "ISCP"
      0x00,
      0x00,
      0x00,
      0x10, // Header size: 16 bytes
      0x00,
      0x00,
      0x00,
      cmdBuffer.length, // Data size: length of the command
      0x01,
      0x00,
      0x00,
      0x00, // Version and reserved bytes
    ]);

    return Buffer.concat([eiscpHeader, cmdBuffer]);
  }

  isConnected(): boolean {
    console.log("=> this.client.readyState", this.client.readyState);
    return this.client.readyState === "open";
  }

  getVolume(): Promise<OnkyoResponse | null> {
    return new Promise((resolve, reject) => {
      console.log("=> before sendCommand");
      this.sendCommand(OnkyoCommands.VOLUME.QUERY);
      console.log("=> after sendCommand");
      this.client.on("data", (data) => {
        const response = this.parseResponse(data);
        console.log("📥 Parsed response:", response);
        resolve(response);
      });
    });
  }

  setVolume(level: number): void {
    if (level < 0 || level > 100) {
      throw new Error("❌ Volume level must be between 0 and 100.");
    }

    const scaledLevel = Math.round((level / 100) * 0x64);
    const hexVolume = scaledLevel.toString(16).toUpperCase().padStart(2, "0");

    this.sendCommand(OnkyoCommands.VOLUME.SET(hexVolume));
    console.log(`🔊 Setting volume to ${level} (hex: ${hexVolume})`);
  }

  powerOn(): void {
    this.sendCommand(OnkyoCommands.POWER.ON);
  }

  powerOff(): void {
    this.sendCommand(OnkyoCommands.POWER.OFF);
  }

  mute(): void {
    this.sendCommand(OnkyoCommands.AUDIO.MUTE_ON);
  }

  unmute(): void {
    this.sendCommand(OnkyoCommands.AUDIO.MUTE_OFF);
  }

  setSource(source: Command<"SOURCE">): void {
    this.sendCommand(OnkyoCommands.SOURCE[source]);
  }

  private parseResponse(data: Buffer): OnkyoResponse | null {
    try {
      const response = data.toString("ascii").slice(16).trim(); // Skip eISCP header
      const command = response.slice(0, 3); // Extract the command (e.g., "PWR", "MVL")
      const value = response.slice(3); // Extract the value (e.g., "01", "UP")

      return { command, value };
    } catch (err) {
      console.error("❌ Failed to parse response:", err);
      return null;
    }
  }
}

export default OnkyoEiscp;
