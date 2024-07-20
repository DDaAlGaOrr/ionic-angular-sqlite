import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { SqliteService } from './../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { UserUpgradeStatements } from '../../upgrades/user.upgrade.statements';
import { Client, serviceAll } from '../../interfaces/General';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

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
    const subsidaryClient: Client[] = (await this.db.query('SELECT * FROM tblclients;')).values as Client[];
    console.log(subsidaryClient)
  }

  async addData(data: Client) {
    const sql = `INSERT INTO tblclients (id, code_client, state, address, type_client, active, zone, company) VALUES (?,?,?,?,?,?,?,?);`;
    await this.db.run(sql, [data.userid, data.code_client, data.state, data.address, data.type_client, data.active, data.zone, data.company]);
    // this.loadData()
  }

  async addServiceAllData(data: serviceAll) {
    const sql = `INSERT INTO tblservice_all (num_Cliente, observaciones_Plagas, observaciones_Plaga, actividad_consumo) VALUES (?,?,?,?);`;
    await this.db.run(sql, [data.Num_Cliente, data.Observaciones_Plagas, data.Observaciones_Plaga, data.Actividad_consumo]);
    // this.loadData()
  }

  async clearUserTable() {
    const sql = `DELETE FROM tblclients`;
    await this.db.run(sql);
  }

  async clearServiceAll() {
    const sql = `DELETE FROM tblservice_all`;
    await this.db.run(sql);
  }

}
