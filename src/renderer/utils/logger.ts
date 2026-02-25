/**
 * 日志工具 - 将控制台输出保存到文件
 */

// 日志级别
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

// 日志条目接口
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // 最大保存日志条数
  private isSaving = false;
  
  constructor() {
    // 重写console方法
    this.overrideConsole();
  }
  
  // 重写console方法
  private overrideConsole() {
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };
    
    // 重写console.log
    console.log = (...args) => {
      this.addLog(LogLevel.INFO, args);
      originalConsole.log.apply(console, args);
    };
    
    // 重写console.info
    console.info = (...args) => {
      this.addLog(LogLevel.INFO, args);
      originalConsole.info.apply(console, args);
    };
    
    // 重写console.warn
    console.warn = (...args) => {
      this.addLog(LogLevel.WARN, args);
      originalConsole.warn.apply(console, args);
    };
    
    // 重写console.error
    console.error = (...args) => {
      this.addLog(LogLevel.ERROR, args);
      originalConsole.error.apply(console, args);
    };
    
    // 重写console.debug
    console.debug = (...args) => {
      this.addLog(LogLevel.DEBUG, args);
      originalConsole.debug.apply(console, args);
    };
  }
  
  // 添加日志
  private addLog(level: LogLevel, args: any[]) {
    try {
      const message = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data: args.length > 1 ? args : undefined
      };
      
      this.logs.push(logEntry);
      
      // 限制日志数量
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs);
      }
      
      // 自动保存到文件（防抖）
      this.debouncedSave();
    } catch (error) {
      // 避免日志记录本身出错
      console.error('日志记录失败:', error);
    }
  }
  
  // 防抖保存
  private debouncedSave() {
    if (this.isSaving) return;
    
    this.isSaving = true;
    setTimeout(() => {
      this.saveToFile();
      this.isSaving = false;
    }, 1000); // 1秒防抖
  }
  
  // 保存到文件
  async saveToFile() {
    try {
      if (!this.logs.length) return;
      
      const logContent = this.logs.map(log => 
        `[${log.timestamp}] [${log.level}] ${log.message}`
      ).join('\n');
      
      // 使用Electron API保存文件
      if (window.electronAPI?.writeLogFile) {
        const result = await window.electronAPI.writeLogFile(logContent);
        if (!result.success) {
          console.error('保存日志文件失败:', result.error);
        }
      } else {
        console.warn('Electron API不可用，无法保存日志到文件');
      }
    } catch (error) {
      console.error('保存日志失败:', error);
    }
  }
  
  // 获取所有日志
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  // 清空日志
  clearLogs() {
    this.logs = [];
  }
  
  // 手动触发保存
  async forceSave() {
    await this.saveToFile();
  }
}

// 创建全局日志实例
export const logger = new Logger();

// 导出便捷方法
export const log = {
  debug: (...args: any[]) => console.debug(...args),
  info: (...args: any[]) => console.info(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
  
  // 直接记录到文件的方法
  file: (message: string, data?: any) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      data
    };
    logger['logs'].push(entry);
    logger['debouncedSave']();
  }
};

// 在应用启动时初始化
export function initLogger() {
  console.log('日志系统已初始化');
  log.file('应用启动', { time: new Date().toISOString() });
}