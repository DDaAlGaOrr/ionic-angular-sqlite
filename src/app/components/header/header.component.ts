import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { ToastService } from 'src/app/services/toast.service';
import { LoggedData } from './../../interfaces/Auth';
import { Activities } from '../../interfaces/Projects';
import { AuthenticationService } from './../../services/authentication.service';
import { StorageService } from './../../services/storage.service';
import { GeneralService } from './../../services/general.service';
import { LoaderService } from './../../services/loader.service';
import { ChecklistSectionService } from '../../services/offline/checklist-section.service'
import { SubsidiaryClientService } from '../../services/offline/subsidiary-client.service';
import { ClientsService } from 'src/app/services/offline/clients.service';
import { ProjectsService } from '../../services/offline/projects.service';
import { TasksService } from '../../services/offline/tasks.service';
import { ContractsTypeService } from '../../services/offline/contracts-type.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  userdata: LoggedData = { email: '', firstname: '', lastname: '', staffid: 0 }
  fechaActual: Date = new Date();

  constructor(
    private authenticationService: AuthenticationService,
    private storageService: StorageService,
    private generalService: GeneralService,
    private loaderService: LoaderService,
    private storage: Storage,
    private checklistSectionService: ChecklistSectionService,
    private subsidiaryClientService: SubsidiaryClientService,
    private clientsService: ClientsService,
    private projectService: ProjectsService,
    private tasksService: TasksService,
    private toastService: ToastService,
    private contractsTypeService: ContractsTypeService,
  ) { this.init() }

  private async init() {
    await this.storage.create();
  }

  async ngOnInit() {
    this.userdata = await this.authenticationService.getLoggedData()

  }

  logout() {
    this.authenticationService.logout();
  }

  async syncDataUser() {
    this.loaderService.show();
    // await this.syncUserTable()
    // this.toastService.presentToast('Tabla usuarios descargada')
    // await this.syncChecklistSectionTable()
    // this.toastService.presentToast('Tabla checklistSections descargada')
    // await this.syncChecklistSubSections()
    // this.toastService.presentToast('Tabla checklistSubSections descargada')
    // await this.syncChecklisTaskForm()
    // this.toastService.presentToast('Tabla checklistTaskForm descargada')
    // await this.syncChecklisQuestions()
    // this.toastService.presentToast('Tabla checklistQuestions descargada')
    // await this.syncSubsidiaryClient()
    // this.toastService.presentToast('Tabla subsidiaryClient descargada')
    // await this.syncClient()
    // this.toastService.presentToast('Tabla client descargada')
    // await this.syncProjects()
    // this.toastService.presentToast('Tabla projects descargada')
    // await this.syncTasks()
    // this.toastService.presentToast('Tabla Tasks descargada')
    // await this.syncContractsType()
    // this.toastService.presentToast('Tabla contractsType descargada')
    await this.syncProjectsItems()
    this.toastService.presentToast('Tabla projectsItems descargada')
    // await this.syncActivities()
    // this.toastService.presentToast('Actividades descargadas')
    
    // this.storageService.showTables()
    this.loaderService.hide();
  }
  async syncUserTable() {
    const users = await this.generalService.getUsersTable(this.userdata.staffid)
    await this.storageService.clearUserTable()
    for (const user of users) {
      await this.storageService.addUser(user.staffid, user.email, user.firstname, user.lastname, 'sipoc');
    }
  }

  async syncActivities() {
    const activities: Activities = await this.generalService.getSipocAcitivities(this.userdata.staffid)
    await this.storage.set('projects', activities.projects)
    await this.storage.set('projectData', activities.projectData)
    await this.storage.set('taskData', activities.taskData)
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
    await this.checklistSectionService.clearUserTable()
    for (const section of data) {
      await this.checklistSectionService.addDataSubSections(section.id, section.name);
    }
  }

  async syncChecklisTaskForm() {
    const data = await this.generalService.getsyncChecklisTaskForm(this.userdata.staffid)
    await this.checklistSectionService.clearUserTable()
    for (const item of data) {
      await this.checklistSectionService.addDataTblchecklistTaskForm(item);
    }
  }

  async syncChecklisQuestions() {
    const data = await this.generalService.getSyncChecklisQuestions(this.userdata.staffid)
    await this.checklistSectionService.clearUserTable()
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

  async syncProjects() {
    const data = await this.generalService.getSyncprojects(this.userdata.staffid)
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

  async syncContractsType() {
    const data = await this.generalService.getSyncContractsType(this.userdata.staffid)
    await this.contractsTypeService.clearUserTable()
    for (const item of data) {
      await this.contractsTypeService.addData(item);
    }
  }

  async syncProjectsItems() {
    const data = await this.generalService.getSyncProjectsItems(this.userdata.staffid)
    await this.projectService.clearUserTable()
    for (const item of data) {
      await this.projectService.addPorjectItem(item);
    }
  }
}
