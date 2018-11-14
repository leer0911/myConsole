import { observable, action } from 'mobx';

interface Log {
  logType: string;
  infos: any[];
}

class LogStore {
  @observable logList: Log[] = [];

  @action
  addLog(log: Log) {
    this.logList.push(log);
  }
  @action
  clearLog() {
    this.logList = [];
  }
}

export const logStore = new LogStore();
