import { observable, action, computed } from 'mobx';

interface Log {
  logType: string;
  infos: any[];
}

class LogStore {
  @observable logList: Log[] = [];
  @observable logType: string = 'All';

  @action
  addLog(log: Log) {
    this.logList.push(log);
  }
  @action
  clearLog() {
    this.logList = [];
  }
  @computed
  get computeLogList() {
    let ret = []
    if (this.logType === 'All') {
      ret = this.logList
    } else {
      ret = this.logList.filter((item) => {
        return item.logType === this.logType.toLowerCase()
      })
    }
    return ret
  }
  @action
  changeLogType(type: string) {
    this.logType = type
  }
}

export const logStore = new LogStore();
