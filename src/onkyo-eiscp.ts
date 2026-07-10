import net from "net";
import { OnkyoCommands } from "./onkyo-commands";

const EISCP_PORT = 60128;
const RESPONSE_TIMEOUT_MS = 3000;

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
      const onError = (err: Error) => {
        cleanup();
        reject(err);
      };

      const cleanup = () => {
        this.client.off("error", onError);
      };

      this.client.once("error", onError);
      this.client.connect(this.port, this.host, () => {
        cleanup();
        resolve();
      });
    });
  }

  sendCommand(command: string): void {
    this.client.write(this.buildEiscpMessage(command));
  }

  disconnect(): void {
    this.client.destroy();
  }

  private buildEiscpMessage(command: string): Uint8Array {
    const cmd = `!1${command}\r`;
    const cmdBuffer = Buffer.from(cmd, "ascii");

    const eiscpHeader = Buffer.from([
      0x49,
      0x53,
      0x43,
      0x50,
      0x00,
      0x00,
      0x00,
      0x10,
      0x00,
      0x00,
      0x00,
      cmdBuffer.length,
      0x01,
      0x00,
      0x00,
      0x00,
    ]);

    return Uint8Array.from([...eiscpHeader, ...cmdBuffer]);
  }

  private waitForResponse(expectedCommand?: string): Promise<OnkyoResponse | null> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Timeout en attente de réponse de l'ampli"));
      }, RESPONSE_TIMEOUT_MS);

      const onData = (data: Buffer) => {
        const response = this.parseResponse(data);
        if (!response) {
          return;
        }

        if (!expectedCommand || response.command === expectedCommand) {
          cleanup();
          resolve(response);
        }
      };

      const onError = (err: Error) => {
        cleanup();
        reject(err);
      };

      const cleanup = () => {
        clearTimeout(timeout);
        this.client.off("data", onData);
        this.client.off("error", onError);
      };

      this.client.on("data", onData);
      this.client.once("error", onError);
    });
  }

  setVolume(level: number | string): void {
    const numericLevel = typeof level === "string" ? Number.parseInt(level, 10) : level;

    if (Number.isNaN(numericLevel) || numericLevel < 0 || numericLevel > 100) {
      throw new Error("Le volume doit être entre 0 et 100.");
    }

    const scaledLevel = Math.round((numericLevel / 100) * 0x64);
    const hexVolume = scaledLevel.toString(16).toUpperCase().padStart(2, "0");
    this.sendCommand(OnkyoCommands.VOLUME.SET(hexVolume));
  }

  adjustVolume(delta: number): void {
    this.sendCommand(delta >= 0 ? OnkyoCommands.VOLUME.UP : OnkyoCommands.VOLUME.DOWN);
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

  async isPowerOn(): Promise<boolean> {
    this.sendCommand(OnkyoCommands.POWER.QUERY);
    const response = await this.waitForResponse("PWR");
    return response?.value.includes(OnkyoCommands.POWER.ON) ?? false;
  }

  setSource(sourceCommand: string): void {
    if (!sourceCommand.startsWith("SLI")) {
      throw new Error(`Commande source invalide: ${sourceCommand}`);
    }

    this.sendCommand(sourceCommand);
  }

  async getCurrentSourceCode(): Promise<string | null> {
    this.sendCommand(OnkyoCommands.SOURCE.QUERY);
    const response = await this.waitForResponse("SLI");
    return response?.value ?? null;
  }

  private parseResponse(data: Buffer): OnkyoResponse | null {
    try {
      const response = data.toString("ascii").slice(16).trim();
      const command = response.slice(0, 3);
      const value = response.slice(3);

      return { command, value };
    } catch {
      return null;
    }
  }
}

export default OnkyoEiscp;
