
import fs from 'fs';
import path from 'path';

type LogType = 'info' | 'error' | 'warn';

class Logger {
  private logFile: string;
  
  constructor() {
    this.logFile = path.join(process.cwd(), 'server.log');
    this.clear();
  }

  clear() {
    fs.writeFileSync(this.logFile, '');
  }

  log(message: string, type: LogType = 'info') {
    const timestamp = new Date().toISOString();
    const logType = String(type).toUpperCase();
    const logMessage = `[${timestamp}] [${logType}] ${message}\n`;
    
    console.log(logMessage);
    fs.appendFileSync(this.logFile, logMessage);
  }
}

export const logger = new Logger();
