import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { SqliteService } from './../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { UserUpgradeStatements } from '../../upgrades/user.upgrade.statements';
import { Project, ProjectsItems } from '../../interfaces/General';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

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
    await this.sqliteService
      .addUpgradeStatement({
        database: this.databaseName,
        upgrade: this.versionUpgrades
      });
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
    const subsidaryClient: Project[] = (await this.db.query('SELECT * FROM tblprojects;')).values as Project[];
    console.log(subsidaryClient)
  }
  async loadProjectsItems() {
    const subsidaryClient: Project[] = (await this.db.query('SELECT * FROM tblprojects_items;')).values as Project[];
    console.log(subsidaryClient)
  }

  async addData(data: Project) {
    const sql = `INSERT INTO tblprojects (id, name, status, clientid, subsidiary_id, client_name, start_date, deadline, project_created, addedfrom, zone, name_zone, assigned) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    await this.db.run(sql, [data.id, data.name, data.status, data.clientid, data.subsidiary_id, data.client_name, data.start_date, data.deadline, data.project_created, data.addedfrom, data.zone, data.name_zone, data.assigned]);
    // this.loadData()
  }

  async addPorjectItem(data: ProjectsItems) {
    const sql = `INSERT INTO tblprojects_items (id, cinturon, grupo_control, porcentaje, project_id, total_tasks) VALUES (?,?,?,?,?,?);`;
    await this.db.run(sql, [data.id, data.cinturon, data.grupo_control, data.porcentaje, data.project_id, data.total_tasks]);
    this.loadProjectsItems()
  }

  async clearUserTable() {
    const sql = `DELETE FROM tblprojects`;
    await this.db.run(sql);
  }

  async clearProjectsItem() {
    const sql1 = `DELETE FROM tblprojects_items`;
    await this.db.run(sql1);
  }

  async getPlanDetail(projectId: number, projectType: string) {

    const getProjectTasks = await this.getProjectTasks(projectId)
    const getServiceArea = await this.getServiceArea(projectId)
    // console.log(getProjectTasks)
    // console.log(getServiceArea)
  }

  async getProjectTasks(projectId: number) {
    try {
      const query = `
        SELECT tbltasks.id,
            tbltasks.folio_number,
            tbltasks.name,
            tbltasks.group_control,
            tbltasks.duedate,
            tbltasks.cinturon,
            tbltasks.status 
        FROM tbltasks
        WHERE tbltasks.rel_type = "project"
        and tbltasks.rel_id = ${projectId} ;
      `;
      const results = (await this.db.query(query)).values;
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
      return false
    }
  }

  async getServiceArea(projectId: number) {
    try {
      const query = `
        SELECT tblprojects_items.cinturon, tblcontracts_types.name 
        FROM tblprojects_items
        INNER JOIN tblprojects ON tblprojects.id = tblprojects_items.project_id
        INNER JOIN tblcontracts_types ON tblcontracts_types.id = tblprojects_items.grupo_control
        WHERE tblprojects_items.project_id = ${projectId}
      `;
      const results = (await this.db.query(query)).values;
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
      return false
    }
  }
}

