import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BaseService } from "../providers/base-service";
import 'rxjs/add/operator/toPromise';
import { LocalNotificationService } from '../providers/local-notification-service';

@Injectable()
export class RemindersService {

  public reminders: any = [
    {
      color1_Id: 2,
      color2_Id: 3,
      dependent_id: 1,
      dose: 1,
      form_Id: 2,
      frequency: "3 times 1",
      id: 1,
      name: 1,
      note:"",
      visible:true,
      refil_date: "",
      start_date: ""
    }
  ];

  public maxId: number;

  constructor(
    private sqlite: SQLite,
    public baseService: BaseService,
    public localNotificationService: LocalNotificationService,
  ) {
    this.maxId = 1;
  }

  getAll() {
    return new Promise((resolve, reject) => {
      try {
        this.sqlite.create({
    			name 	: 'data.db',
    			location: 'default'
    		})
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM reminders", [])
          .then((data) => {
            let retVal = [];
            if(data.rows.length > 0) {
              for(var i = 0; i < data.rows.length; i++) {
                let retValItem = {
                  reminders: ''
                };
                retValItem = data.rows.item(i);
                if (retValItem.reminders) {
                  retValItem.reminders = JSON.parse(retValItem.reminders);
                }
                retVal.push(retValItem);
              }
            }
            resolve(retVal);
          })
          .catch((err) => {
            reject(err);
          });
        });
      } catch(e) {
        reject(e);
      }
    })
  }

  getForDependent(id) {
    console.log(id);
    return new Promise((resolve, reject) => {
      try {
        this.sqlite.create({
    			name 	: 'data.db',
    			location: 'default'
    		})
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM reminders WHERE dependent_id = " + id, [])
          .then((data) => {
            let retVal = [];
            if(data.rows.length > 0) {
              for(var i = 0; i < data.rows.length; i++) {
                let retValItem = {
                  reminders: ''
                };
                retValItem = data.rows.item(i);
                if (retValItem.reminders) {
                  retValItem.reminders = JSON.parse(retValItem.reminders);
                }
                retVal.push(retValItem);
              }
            }
            resolve(retVal);
          })
          .catch((err) => {
            reject(err);
          });
        });
      } catch(e) {
        reject(e);
      }
    })
  }

  getForToday() {
    let today = new Date();
    let dayCode = today.getDay() + 1;
    return new Promise((resolve, reject) => {
      try {
        this.sqlite.create({
    			name 	: 'data.db',
    			location: 'default'
    		})
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM reminders WHERE scheduled = " + 1, [])
          .then((data) => {
            let retVal = [];
            if(data.rows.length > 0) {
              for(var i = 0; i < data.rows.length; i++) {
                let itemTem = data.rows.item(i);
                let freq = itemTem.frequency;
                let x = freq.split(" ");
                let schedule = +x[2];
                if (schedule == 1) {
                  if (itemTem.reminders) {
                    let remindersTem = JSON.parse(itemTem.reminders);
                    for (let k = 0; k < remindersTem.length; k++) {
                      let kkk = remindersTem[k].value.split(" ");
                      retVal.push({
                        id: itemTem.id,
                        name: itemTem.name,
                        reminder: {
                          time: kkk[0],
                          minute: kkk[1],
                          ap: kkk[2] == 1 ? "AM" : "PM"
                        }
                      })
                    }
                  }

                } else if (schedule == 2){
                  if (itemTem.reminders) {
                    let remindersTem = JSON.parse(itemTem.reminders);
                    console.log(remindersTem);
                    if (remindersTem.length) {
                      for (let j = 0; j < remindersTem.length; j++) {
                        let reminder = remindersTem[j].value.split(" ");
                        let myDay = reminder[0];
                        if (myDay == dayCode) {
                          retVal.push({
                            id: itemTem.id,
                            name: itemTem.name,
                            reminder: {
                              time: reminder[1],
                              minute: reminder[2],
                              ap: reminder[3] == 1 ? "AM" : "PM"
                            }
                          })
                        }
                      }
                    }
                  }
                  console.log(data.rows.item(i))
                }
              }
            }
            resolve(retVal);
          })
          .catch((err) => {
            reject(err);
          });
        });
      } catch(e) {
        reject(e);
      }
    })
  }

  get(id) {
    return new Promise((resolve, reject) => {
      try {
        this.sqlite.create({
    			name 	: 'data.db',
    			location: 'default'
    		})
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM reminders WHERE id = " + id, [])
          .then((data) => {
            let retVal = {
              reminders: ''
            };
            if(data.rows.length > 0) {
              retVal = data.rows.item(0);
              if (retVal.reminders) {
                retVal.reminders = JSON.parse(retVal.reminders);
              }
            }
            resolve(retVal);
          })
          .catch((err) => {
            reject(err);
          });
        });
      } catch(e) {
        reject(e);
      }
    })
  }

  add(data) {
    let value = {
      color1_Id : +data.color1_Id,
      color2_Id : +data.color2_Id,
      form_Id : +data.form_Id,
      dependent_id : +data.dependent_id,
      dose : +data.dose,
      frequency : data.frequency,
      name : data.name,
      note : data.note,
      reminders : data.reminders ? JSON.stringify(data.reminders) : "",
      quantity: data.quantity ? data.quantity : 0,
      take_as_needed: data.take_as_needed ? 1 : 0,
      scheduled: data.scheduled ? 1 : 0
    };
    return new Promise((resolve, reject) => {
      try {
        this.sqlite.create({
    			name 	: 'data.db',
    			location: 'default'
    		})
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM reminders WHERE name = (?) AND dependent_id = (?)", [value.name, value.dependent_id])
          .then((data) => {
            if(data.rows.length > 0) {
              resolve('exist');
            } else {
              db.executeSql("\
                            INSERT INTO\
                            reminders (\
                              color1_Id,\
                              color2_Id,\
                              form_Id,\
                              dependent_id,\
                              dose,\
                              frequency,\
                              name,\
                              note,\
                              reminders,\
                              quantity,\
                              take_as_needed,\
                              scheduled)\
                            VALUES (\
                              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\
                            ", [value.color1_Id, value.color2_Id, value.form_Id, value.dependent_id, value.dose, value.frequency, value.name, value.note, value.reminders, value.quantity, value.take_as_needed, value.scheduled])
              .then((data) => {
                 console.log(JSON.stringify(data.rows.item(0)));
                 resolve(data.rows.item(0));
              })
              .catch((err) => {
                console.log(err);
                reject(err);
              });
            }
          })
          .catch((err) => {
            reject(err);
          });
        });
      } catch(e) {
        reject(e);
      }
    })
  }

  update(data) {
    this.localNotificationService.addNotification(data);
    let value = {
      color1_Id : +data.color1_Id,
      color2_Id : +data.color2_Id,
      form_Id : +data.form_Id,
      dependent_id : +data.dependent_id,
      dose : +data.dose,
      frequency : data.frequency,
      name : data.name,
      note : data.note,
      reminders : data.reminders ? JSON.stringify(data.reminders) : "",
      quantity: data.quantity ? data.quantity : 0,
      take_as_needed: data.take_as_needed ? 1 : 0,
      scheduled: data.scheduled ? 1 : 0
    };
    let that = this;
    return new Promise((resolve, reject) => {
      try {
        this.sqlite.create({
    			name 	: 'data.db',
    			location: 'default'
    		})
        .then((db: SQLiteObject) => {
          db.executeSql("UPDATE reminders SET color1_Id=(?), color2_Id=(?), form_Id=(?), dependent_id=(?), dose=(?), frequency=(?), name=(?), note=(?), reminders=(?), quantity=(?), take_as_needed=(?), scheduled=(?) WHERE id=" + data.id, [value.color1_Id, value.color2_Id, value.form_Id, value.dependent_id, value.dose, value.frequency, value.name, value.note, value.reminders, value.quantity, value.take_as_needed, value.scheduled])
          .then((data) => {
             resolve('ok')
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
        });
      } catch(e) {
        reject(e);
      }
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      try {
        this.sqlite.create({
    			name 	: 'data.db',
    			location: 'default'
    		})
        .then((db: SQLiteObject) => {
          db.executeSql("DELETE FROM reminders WHERE id = (?)", [id])
          .then((data) => {
             resolve('ok')
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
        });
      } catch(e) {
        reject(e);
      }
    });
  }
}
