type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  level: LogLevel;
  isDevelopment: boolean;
}

class Logger {
  private options: LoggerOptions;

  constructor(options: LoggerOptions) {
    this.options = options;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.options.isDevelopment) return false;
    
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.options.level);
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    // Create a deep copy to avoid modifying the original
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'email', 'token', 'session', 'cookie', 'auth'];
    
    const removeSensitiveData = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      
      Object.keys(obj).forEach(key => {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          removeSensitiveData(obj[key]);
        }
      });
    };

    removeSensitiveData(sanitized);
    return sanitized;
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, data ? this.sanitizeData(data) : '');
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.log(`[INFO] ${message}`, data ? this.sanitizeData(data) : '');
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, data ? this.sanitizeData(data) : '');
    }
  }

  error(message: string, error?: any) {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error ? this.sanitizeData(error) : '');
    }
  }
}

// Create a singleton instance
export const logger = new Logger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  isDevelopment: process.env.NODE_ENV === 'development'
}); 