import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { SqliteService } from './../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { UserUpgradeStatements } from '../../upgrades/user.upgrade.statements';
import { ContractsTypes } from '../../interfaces/General';

@Injectable({
  providedIn: 'root'
})
export class ContractsTypeService {

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
    const contracType: ContractsTypes[] = (await this.db.query('SELECT * FROM tblcontracts_types;')).values as ContractsTypes[];
    console.log(contracType)
  }

  async addData(data: ContractsTypes) {
    const sql = `INSERT INTO tblcontracts_types (id, name) VALUES (?,?);`;
    await this.db.run(sql, [data.id, data.name]);
    this.loadData()
  }

  async clearUserTable() {
    const sql = `DELETE FROM tblcontracts_types`;
    await this.db.run(sql);
  }
}
