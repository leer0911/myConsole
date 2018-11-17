import { observable, action, computed } from 'mobx';

export interface LogType {
  logType: string;
  infos: any[];
}

export class LogStore {
  @observable logList: LogType[] = [];
  @observable logType: string = 'All';

  @action
  addLog(log: LogType) {
    this.logList.push(log);
  }
  @action
  clearLog() {
    this.logList = [];
  }
  @computed
  get computeLogList() {
    let ret: LogType[] = []
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

export default new LogStore()
