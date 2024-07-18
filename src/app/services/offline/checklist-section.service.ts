import { Injectable } from '@angular/core';

import { SqliteService } from './../sqlite.service';
import { UserUpgradeStatements } from '../../upgrades/user.upgrade.statements';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DbnameVersionService } from '../dbname-version.service';
import { ChecklistQuestions, ChecklistSections, ChecklistTaskForm } from '../../interfaces/Checklist';




@Injectable({
  providedIn: 'root'
})
export class ChecklistSectionService {

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

  async loadData() {
    const sections: ChecklistSections[] = (await this.db.query('SELECT * FROM tblchecklist_section;')).values as ChecklistSections[];
    const subSections: ChecklistSections[] = (await this.db.query('SELECT * FROM tblchecklist_sub_section;')).values as ChecklistSections[];
    const taskForm: ChecklistTaskForm[] = (await this.db.query('SELECT * FROM tblchecklist_task_form;')).values as ChecklistTaskForm[];
    const questions: ChecklistQuestions[] = (await this.db.query('SELECT * FROM tblchecklist_questions;')).values as ChecklistQuestions[];
    console.log(sections)
    console.log(subSections)
    console.log(taskForm)
    console.log(questions)
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

  async addData(id: number, name: string) {
    const sql = `INSERT INTO tblchecklist_section (id, name) VALUES (?,?);`;
    await this.db.run(sql, [id, name]);
    // this.loadData()
  }

  async addDataSubSections(id: number, name: string) {
    const sql = `INSERT INTO tblchecklist_sub_section (id, name) VALUES (?,?);`;
    await this.db.run(sql, [id, name]);
    // this.loadData()
  }

  async addDataTblchecklistTaskForm(data: ChecklistTaskForm) {
    const sql = `INSERT INTO tblchecklist_task_form (id, task_id, rel_type, answered, signature_picture, evidence_type) VALUES (?,?,?,?,?,?);`;
    await this.db.run(sql, [data.id, data.task_id, data.rel_type, data.answered, data.signature_picture, data.evidence_type]);
    // this.loadData()
  }

  async addDataTblchecklistQuestions(data: ChecklistQuestions) {
    const sql = `INSERT INTO tblchecklist_questions (id,id_form,form_id, id_section, id_sub_section, description) VALUES (?,?,?,?,?,?);`;
    await this.db.run(sql, [data.id, data.id_form, data.id_form, data.id_section, data.id_sub_section, data.description]);
    // this.loadData()
  }

  async clearUserTable() {
    const sql = `DELETE FROM tblchecklist_section`;
    await this.db.run(sql);
    const sql2 = `DELETE FROM tblchecklist_sub_section`;
    await this.db.run(sql2);
    const sql3 = `DELETE FROM tblchecklist_task_form`;
    await this.db.run(sql3);
    const sql4 = `DELETE FROM tblchecklist_questions`;
    await this.db.run(sql4);
  }

}
