import fs from "fs";
import { Config } from "twilio/lib/twiml/VoiceResponse";
import { companions } from '@/app/api/companions/config';

class ConfigManager {
  private static instance: ConfigManager;
  private config: any;

  private constructor() {
    this.config = companions;
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(fieldName: string, configValue: string) {
    //).filter((c: any) => c.name === companionName);
    try {
      if (!!this.config && this.config.length !== 0) {
        const result = this.config.filter(
          (c: any) => c[fieldName] === configValue
        );
        if (result.length !== 0) {
          return result[0];
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export default ConfigManager;
