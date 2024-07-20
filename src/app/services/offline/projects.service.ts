import { Injectable, Provider } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { SqliteService } from './../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { UserUpgradeStatements } from '../../upgrades/user.upgrade.statements';
import { Project, ProjectsItems } from '../../interfaces/General';
import { planDetail } from '../../interfaces/Project';


interface Products {
  num_Cliente: string
  actividad_consumo: string
}
interface Technicians {
  num_Cliente: string
  observaciones_Plagas: string
  observaciones_Plaga: string
}


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

    const projectTasks: any[] = await this.getProjectTasks(projectId) as any[]
    const serviceArea: any[] = await this.getServiceArea(projectId) as any[]
    const cinturones = await this.getCinturones(projectId)
    const planDetail: planDetail[] = await this.getPlanDetails(projectId) as planDetail[]
    const checklistItems = await this.getChecklistItems(projectId, projectType)
    const checklists = await this.getChecklists(projectId, projectType)
    const data = {
      projectTasks,
      serviceArea,
      cinturones,
      planDetail,
      checklistItems,
      checklists
    }
    return data
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

  async getCinturones(projectId: number) {
    try {
      const query = `
        SELECT cinturon
        FROM tblprojects_items
        WHERE project_id = ${projectId}
        ORDER BY id DESC
        LIMIT 1 
      `;
      const results: any[] = (await this.db.query(query)).values as any[];
      return results[0].cinturon;
    } catch (error) {
      console.error('Error executing query:', error);
      return false
    }
  }

  async getPlanDetails(projectId: number) {
    try {
      const query = `
        SELECT tblprojects.name as folio, tblclients.company as client, tblsubsidiary_client.client_name as subsidiary, tblsubsidiary_client.id_subsidiary
        FROM tblprojects
        INNER JOIN tblclients on tblclients.code_client = tblprojects.clientid
        INNER JOIN tblsubsidiary_client on tblsubsidiary_client.id_subsidiary = tblprojects.subsidiary_id
        WHERE tblprojects.id = ${projectId}
      `;
      const results = (await this.db.query(query)).values;
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
      return false
    }
  }

  async getChecklistItems(id: number, relType: string, isTask: boolean = false) {
    try {
      if (!isTask) {
        if (relType == "project" || relType == 'task_uv') {
          const query = `
            SELECT tblchecklist_questions.id,
              tblchecklist_questions.description,
              tblchecklist_section.name AS section_name,
              tblchecklist_section.id AS section_id,
              tblchecklist_sub_section.name AS sub_section_name,
              tblchecklist_sub_section.id AS sub_section_id
            FROM tblchecklist_questions
            INNER JOIN tblchecklist_task_form ON tblchecklist_task_form.form_id = tblchecklist_questions.id_form
            INNER JOIN tblchecklist_section ON tblchecklist_section.id = tblchecklist_questions.id_section
            LEFT JOIN tblchecklist_sub_section ON tblchecklist_sub_section.id = tblchecklist_questions.id_sub_section
            WHERE tblchecklist_task_form.task_id = ${id}
            AND tblchecklist_task_form.rel_type = "${relType}"
            AND tblchecklist_task_form.answered IS NULL
            ORDER BY tblchecklist_section.id, tblchecklist_sub_section.id, tblchecklist_questions.id;
        `;
          const results = (await this.db.query(query)).values;
          if (results) {
            const resultArray: any[] = [];

            results.forEach(item => {
              const sectionId = item.section_id;
              const subSectionName = item.sub_section_name;

              if (!resultArray[sectionId]) {
                resultArray[sectionId] = [];
              }

              if (subSectionName !== null && !(resultArray[sectionId][subSectionName])) {
                resultArray[sectionId][subSectionName] = [];
              }

              const currentArray = subSectionName !== null ? resultArray[sectionId][subSectionName] : resultArray[sectionId];

              currentArray.push({
                question_id: item.id,
                question_description: item.description
              });

              if (subSectionName !== null) {
                resultArray[sectionId][subSectionName] = currentArray;
              } else {
                resultArray[sectionId] = currentArray;
              }
            });

            return resultArray;
          }
          return []
        }
        else {
          return []
        }
      }
      else {
        const query = `
                SELECT tblchecklist_questions.id,tblchecklist_questions.description, tblchecklist_section.name,tblchecklist_section.id as section_id
          FROM tblchecklist_questions
          INNER JOIN tblchecklist_task_form ON tblchecklist_task_form.form_id = tblchecklist_questions.id_form
          INNER JOIN tblchecklist_section ON tblchecklist_section.id = tblchecklist_questions.id_section
          WHERE tblchecklist_task_form.task_id = ${id}
          AND tblchecklist_task_form.rel_type = ${relType}
          AND tblchecklist_task_form.answered IS NULL
        `;
        const results = (await this.db.query(query)).values;
        return results;
      }
    } catch (error) {
      console.error('Error executing query:', error);
      return false
    }
  }

  async getChecklists(id_task: number = 0, rel_type: string = '') {
    try {
      const query = `
        SELECT * FROM tblchecklist_tasks
        INNER JOIN tblchecklist_task_form on tblchecklist_task_form.form_id = tblchecklist_tasks.id
        WHERE tblchecklist_task_form.task_id = ${id_task}
        AND tblchecklist_task_form.rel_type = "${rel_type}"
        AND tblchecklist_task_form.answered IS NULL
      `;
      const results = (await this.db.query(query)).values;
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
      return false
    }
  }

  async getDocumentalChecklist(projectId: number = 0, projectType: string = '') {
    const checklistItems: any = await this.getChecklistItems(projectId, projectType)
    const checklists = await this.getChecklists(projectId, projectType)
    const checklist_sections: any = await this.getProjectSections(projectId, projectType)
    const products: any = await this.getProducts(projectId, projectType)
    return {
      items: checklistItems,
      checklist: checklists,
      checklist_sections: checklist_sections,
      products: products
    }
    console.log(products)
  }

  async getProjectSections(projectId: number, relType: string) {
    try {
      const query = `
        SELECT tblchecklist_section.id, tblchecklist_section.name 
        FROM tblchecklist_section
        INNER JOIN tblchecklist_questions on tblchecklist_questions.id_section = tblchecklist_section.id
        INNER JOIN tblchecklist_task_form on tblchecklist_task_form.form_id = tblchecklist_questions.id_form
        WHERE tblchecklist_task_form.task_id = ${projectId}
        AND tblchecklist_task_form.rel_type = "${relType}"
        GROUP BY tblchecklist_section.id
      `;
      const results = (await this.db.query(query)).values;
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
      return false
    }
  }

  async getProducts(projectId: number, relType: string) {
    try {
      let getSubsidiary = ""
      if (relType == "project") {
        getSubsidiary = `
          SELECT subsidiary_id 
          FROM tblprojects
          WHERE id = ${projectId}
        `;
      } else {
        getSubsidiary = `
          SELECT subsidiary_id 
          FROM tblprojects
          WHERE id = ${projectId}
        `;
      }
      const subsidiary: any = (await this.db.query(getSubsidiary)).values;
      const subsidiaryId = subsidiary[0].subsidiary_id
      const products = await this.getTechniciansProducts(subsidiaryId)
      const technicians = await this.getTechniciansName(subsidiaryId)
      return {
        products: products,
        technicians_name: technicians
      }
    } catch (error) {
      console.error('Error executing query:', error);
      return false
    }
  }

  async getTechniciansProducts(subsidiaryId: string) {
    try {
      const products: any = []
      const query = `
        SELECT Num_Cliente,Actividad_consumo 
        FROM tblservice_all
        WHERE num_Cliente = "${subsidiaryId}"
        GROUP BY Actividad_consumo
      `;
      const results: Products[] = (await this.db.query(query)).values as Products[];
      results?.forEach(product => {
        if (product['actividad_consumo']) {
          products.push(product['actividad_consumo'])
        }
      })
      return products;
    } catch (error) {
      console.error('Error executing query:', error);
      return false
    }
  }
  async getTechniciansName(subsidiaryId: string) {
    try {
      const technicians: any = [];
      const query = `
        SELECT num_Cliente,observaciones_Plagas,observaciones_Plaga
        FROM tblservice_all
        WHERE num_Cliente = "${subsidiaryId}"
        GROUP BY observaciones_Plagas
      `;
      const results: Technicians[] = (await this.db.query(query)).values as Technicians[];
      results.forEach(technician => {
        if (technician['observaciones_Plagas'] && technician['observaciones_Plaga']) {
          technicians.push(`${technician['observaciones_Plagas']}  ${technician['observaciones_Plaga']}`);
        }
      })
      return technicians;
    } catch (error) {
      console.error('Error executing query:', error);
      return false
    }
  }
}

