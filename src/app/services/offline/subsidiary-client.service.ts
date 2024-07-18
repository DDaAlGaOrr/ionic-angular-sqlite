import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { SqliteService } from './../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { UserUpgradeStatements } from '../../upgrades/user.upgrade.statements';
import { SubsidiaryClient } from '../../interfaces/General';

@Injectable({
  providedIn: 'root'
})
export class SubsidiaryClientService {

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
    const subsidaryClient: SubsidiaryClient[] = (await this.db.query('SELECT * FROM tblsubsidiary_client;')).values as SubsidiaryClient[];
    console.log(subsidaryClient)
  }

  async addData(data: SubsidiaryClient) {
    const sql = `INSERT INTO tblsubsidiary_client (id,code_client,client_parent,id_hh,id_subsidiary,client_name,address,state,zone,reg,dirreg) VALUES (?,?,?,?,?,?,?,?,?,?,?);`;
    await this.db.run(sql, [data.id, data.code_client, data.client_parent, data.id_hh, data.id_subsidiary, data.client_name, data.address, data.state, data.zone,data.reg, data.dirreg]);
    // this.loadData()
  }

  async clearUserTable() {
    const sql = `DELETE FROM tblsubsidiary_client`;
    await this.db.run(sql);
  }
}
