import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { GeneralService } from '../../services/general.service';
import { StorageService } from '../../services/storage.service';
import { LoggedData } from '../../interfaces/Auth';
import { ChecklistSectionService } from '../../services/offline/checklist-section.service';
import { SubsidiaryClientService } from '../../services/offline/subsidiary-client.service';
import { ClientsService } from '../../services/offline/clients.service';
import { ContractsTypeService } from '../../services/offline/contracts-type.service';
import { ProjectsService } from '../../services/offline/projects.service';
import { TasksService } from '../../services/offline/tasks.service';
import { Activities } from '../../interfaces/Projects';

@Component({
  selector: 'app-sync-data',
  templateUrl: './sync-data.page.html',
  styleUrls: ['./sync-data.page.scss'],
})
export class SyncDataPage implements OnInit {

  userdata: LoggedData = { email: '', firstname: '', lastname: '', staffid: 0, role: 0 }

  constructor(
    private storageService: StorageService,
    private generalService: GeneralService,
    private checklistSectionService: ChecklistSectionService,
    private subsidiaryClientService: SubsidiaryClientService,
    private clientsService: ClientsService,
    private contractsTypeService: ContractsTypeService,
    private projectService: ProjectsService,
    private tasksService: TasksService,
    private storage: Storage,
  ) { }

  ngOnInit() {
  }

  async syncUsersData() {
    await this.syncUserTable()
  }

  async syncChecklistsData() {
    await this.syncChecklistSectionTable()
    await this.syncChecklistSubSections()
    await this.syncChecklisQuestions()
  }

  async syncAppData() {
    await this.syncSubsidiaryClient()
    await this.syncClient()
    await this.syncContractsType()
    await this.syncServiceAll()
  }

  async syncActivitiesData() {
    await this.syncChecklisTaskForm()
    await this.syncProjects()
    await this.syncTasks()
    await this.syncProjectsItems()
    await this.syncActivities()
    await this.syncChecklistTasks()
  }

  async syncUserTable() {
    const users = await this.generalService.getUsersTable(this.userdata.staffid)
    await this.storageService.clearUserTable()
    for (const user of users) {
      await this.storageService.addUser(user.staffid, user.email, user.firstname, user.lastname, 'sipoc');
    }
  }

  async syncChecklistSectionTable() {
    const data = await this.generalService.getSyncChecklistSections(this.userdata.staffid)
    await this.checklistSectionService.clearUserTable()
    for (const section of data) {
      await this.checklistSectionService.addData(section.id, section.name);
    }
  }

  async syncChecklistSubSections() {
    const data = await this.generalService.getSyncChecklistSubSections(this.userdata.staffid)
    await this.checklistSectionService.clearChecklistSubSection()
    for (const section of data) {
      await this.checklistSectionService.addDataSubSections(section.id, section.name);
    }
  }

  async syncChecklisQuestions() {
    const data = await this.generalService.getSyncChecklisQuestions(this.userdata.staffid)
    await this.checklistSectionService.clearChecklistQuestions()
    for (const item of data) {
      await this.checklistSectionService.addDataTblchecklistQuestions(item);
    }
  }

  async syncSubsidiaryClient() {
    const data = await this.generalService.getSyncSubsidiaryClient(this.userdata.staffid)
    await this.subsidiaryClientService.clearUserTable()
    for (const item of data) {
      await this.subsidiaryClientService.addData(item);
    }
  }

  async syncClient() {
    const data = await this.generalService.getSyncClient(this.userdata.staffid)
    await this.clientsService.clearUserTable()
    for (const item of data) {
      await this.clientsService.addData(item);
    }
  }

  async syncContractsType() {
    const data = await this.generalService.getSyncContractsType(this.userdata.staffid)
    await this.contractsTypeService.clearUserTable()
    for (const item of data) {
      await this.contractsTypeService.addData(item);
    }
  }

  async syncServiceAll() {
    const data = await this.generalService.getSyncServiceAll(this.userdata.staffid)
    await this.clientsService.clearServiceAll()
    for (const item of data) {
      await this.clientsService.addServiceAllData(item);
    }
  }

  async syncChecklisTaskForm() {
    const data = await this.generalService.getsyncChecklisTaskForm(this.userdata.staffid)
    await this.checklistSectionService.clearChecklistTaskForm()
    for (const item of data) {
      await this.checklistSectionService.addDataTblchecklistTaskForm(item);
    }
  }

  async syncProjects() {
    const data = await this.generalService.getSyncprojects(this.userdata.staffid)
    console.log(data)
    await this.projectService.clearUserTable()
    for (const item of data) {
      await this.projectService.addData(item);
    }
  }

  async syncTasks() {
    const data = await this.generalService.getSyncTasks(this.userdata.staffid, 'getSyncTasks')
    await this.tasksService.clearUserTable()
    for (const item of data) {
      await this.tasksService.addData(item);
    }
  }

  async syncProjectsItems() {
    const data = await this.generalService.getSyncProjectsItems(this.userdata.staffid)
    await this.projectService.clearProjectsItem()
    for (const item of data) {
      await this.projectService.addPorjectItem(item);
    }
  }

  async syncActivities() {
    const activities: Activities = await this.generalService.getSipocAcitivities(this.userdata.staffid)
    await this.storage.set('projects', activities.projects)
    await this.storage.set('projectData', activities.projectData)
    await this.storage.set('taskData', activities.taskData)
  }

  async syncChecklistTasks() {
    const data = await this.generalService.getSyncChecklistTasks(this.userdata.staffid)
    await this.checklistSectionService.clearChecklistTasks()
    for (const item of data) {
      await this.checklistSectionService.addDataTblchecklistTasks(item);
    }
  }
}
