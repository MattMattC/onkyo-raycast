import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import OnkyoEiscp from "./onkyo-eiscp";

type Preferences = {
  ip: string;
};

const DEFAULT_IP = "192.168.1.54";
const DISCONNECT_DELAY_MS = 500;

export function getOnkyoIp(): string {
  const { ip } = getPreferenceValues<Preferences>();
  return ip?.trim() || DEFAULT_IP;
}

export async function withOnkyo<T>(
  action: (receiver: OnkyoEiscp) => Promise<T> | T,
  options?: { successTitle?: string; successMessage?: string },
): Promise<T | undefined> {
  const receiver = new OnkyoEiscp(getOnkyoIp());

  try {
    await receiver.connect();
    const result = await action(receiver);

    if (options?.successTitle) {
      showToast({
        title: options.successTitle,
        message: options.successMessage,
        style: Toast.Style.Success,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, DISCONNECT_DELAY_MS));
    receiver.disconnect();
    return result;
  } catch (error) {
    receiver.disconnect();
    showToast({
      title: "Erreur",
      message: String(error),
      style: Toast.Style.Failure,
    });
  }
}
