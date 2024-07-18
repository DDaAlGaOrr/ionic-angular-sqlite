import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { SqliteService } from './../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { UserUpgradeStatements } from '../../upgrades/user.upgrade.statements';
import { Task } from '../../interfaces/General';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private databaseName: string = "";
  private versionUpgrades;
  private uUpdStmts: UserUpgradeStatements = new UserUpgradeStatements();
  private db!: SQLiteDBConnection;
  private loadToVersion;


  constructor(
    private sqliteService: SqliteService,
    private dbVerService: DbnameVersionService
  ) {
    this.versionUpgrades = this.uUpdStmts.userUpgrades;
    this.loadToVersion = this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;
  }

  async initializeDatabase(dbName: string) {
    this.databaseName = dbName;
    // create upgrade statements
    await this.sqliteService
      .addUpgradeStatement({
        database: this.databaseName,
        upgrade: this.versionUpgrades
      });
    // create and/or open the database
    this.db = await this.sqliteService.openDatabase(
      this.databaseName,
      false,
      'no-encryption',
      this.loadToVersion,
      false
    );
    this.dbVerService.set(this.databaseName, this.loadToVersion);
  }

  async loadData() {
    const tasks: Task[] = (await this.db.query('SELECT * FROM tbltasks;')).values as Task[];
  }

  async addData(data: Task) {
    const sql = `INSERT INTO tbltasks (id, folio_number, name, group_control, dateadded, startdate, subsidiary_id, uv_task, cinturon, duedate, addedfrom, status, rel_id, rel_type, type_task) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    await this.db.run(sql, [data.id, data.folio_number, data.name, data.group_control, data.dateadded, data.startdate, data.subsidiary_id, data.uv_task, data.cinturon, data.duedate, data.addedfrom, data.status, data.rel_id, data.rel_type, data.type_task]);
  }

  async clearUserTable() {
    const sql = `DELETE FROM tbltasks`;
    await this.db.run(sql);
  }

}
