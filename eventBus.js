

// /js/eventBus.js
class EventBus {
    constructor() {
      this.events = {};
    }
    on(event, listener) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(listener);
    }
    emit(event, data) {
      if (this.events[event]) {
        this.events[event].forEach(listener => listener(data));
      }
    }
  }
  
  // السطر الجديد والمهم: قم بإنشاء نسخة واحدة وقم بتصديرها كافتراضي
  export default new EventBus();
  