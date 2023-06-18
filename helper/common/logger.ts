import * as fs from 'fs';
import * as path from 'path';
import { Common } from './common';

export async function writeLogToFile(log: string): Promise<void> {
    //   const logFilePath = path.join(__dirname, 'logs', 'app.log');
    const timeNow: String = Common.getCurrentTime()
    const fileLogName: String = timeNow.substring(0,10)
    const logFilePath = `log/${fileLogName}.txt`;

    // Create the logs directory if it doesn't exist
    if (!fs.existsSync(path.dirname(logFilePath))) {
        fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    }

    // Append the log to the file

    const headLog = timeNow + " " + Common.AppName + ": "
    await fs.appendFileSync(logFilePath, headLog + log + '\n');
}
