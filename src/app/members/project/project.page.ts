import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  NonNullableFormBuilder,
  FormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

import { DocumentalChecklistService } from '../../services/documental-checklist.service';
import { NetworkService } from '../../services/network.service';
import { ProjectService } from '../../services/project.service';
import { LoaderService } from '../../services/loader.service';
import { PlanDetail, TasksGroup } from '../../interfaces/Checklist';
import { DocumentalModalService } from '../../services/documental-modal.service';
import { ProgressService } from '../../services/progress.service';
import { TaskChecklistService } from '../../services/task-checklist.service';
import { TaskModalService } from '../../services/task-modal.service';
import { ToastService } from '../../services/toast.service';
import { TicketsService } from '../../services/tickets.service';
import { SubmitService } from '../../services/submit.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
  clientName: string = '';
  subsdiaryName: string = ''
  planName: string = '';
  checklistItems: string = '';
  tasksData: any[] = [];
  tasksBelts: any[] = [];
  formattedTasks: any[] = [];
  selectedSegment: 'documental' | 'piso' = 'documental';
  evidenceType: string = '';
  currentPage: number = 1;
  totalPages: number = 30;
  currentProgress = 5;
  selectedOption: number = 0;
  sectionList: any[] = [];
  sectionListItems: any[] = [];
  productsDocumntalChecklist: any = [];
  selectedTexts: string[] = [];
  techniciansDocumntalChecklist: any = [];
  selectedTextsTechnicians: string[] = [];
  reasonDocumentalAnswer: string = ""
  projectType: string = '';
  projectId: number = 0;
  uvTotalTasks: TasksGroup = {};
  selectedItem: number | null = null;
  totalDocumentalItems: number = 0
  productsDocumntalChecklistAnswers: any = {}
  techniciansDocumntalChecklistAnswers: any = {}
  subsidiaryId: string = ""
  showIncidentsButton: boolean = false

  constructor(
    private documentalChecklistService: DocumentalChecklistService,
    private networkService: NetworkService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private fb: NonNullableFormBuilder,
    private loaderService: LoaderService,
    private documentalModalService: DocumentalModalService,
    private progressService: ProgressService,
    private taskChecklistService: TaskChecklistService,
    private taskModalService: TaskModalService,
    private toastService: ToastService,
    private ticketsService: TicketsService,
    private router: Router,
    private submitService: SubmitService,
  ) { }

  validateForm: FormGroup<{
    comentario: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    comentario: ['', [Validators.required]],
    remember: [true],
  });

  async ngOnInit() {
    this.loaderService.show();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.projectId = params['project_id'];
      this.projectType = params['type'];
    })
    if (this.projectType == 'project') {
      const planDetail = await this.projectService.getProjectTasks(this.projectId, this.projectType)
      console.log(planDetail)
      this.tasksData = planDetail.tasksData
      this.clientName = planDetail.clientName
      this.subsdiaryName = planDetail.subsdiaryName
      this.planName = planDetail.planName
      this.checklistItems = planDetail.checklistItems
      this.tasksBelts = planDetail.formattedTask.tasksBelts
      this.formattedTasks = planDetail.formattedTask.formattedTasks
      this.subsidiaryId = planDetail.subsidiaryId
      // const haveIncidents = await this.haveIncidents(planDetail.subsidiaryId)
      // haveIncidents.length > 0 ? this.showIncidentsButton = true : this.showIncidentsButton = false
      this.showIncidentsButton = true

      const documental = await this.projectService.getProjectDocumentalChecklist(this.projectId, this.projectType)
      console.log(documental)
      this.totalPages = documental.totalPages
      this.sectionList = documental.sectionList
      this.sectionListItems = documental.sectionListItems
      this.productsDocumntalChecklistAnswers = documental.productsDocumntalChecklistAnswers
      this.techniciansDocumntalChecklistAnswers = documental.techniciansDocumntalChecklistAnswers
      this.productsDocumntalChecklist = documental.productsDocumntalChecklist
      this.techniciansDocumntalChecklist = documental.techniciansDocumntalChecklist
      this.totalDocumentalItems = documental.totalDocumentalItems
    } else {
      await this.projectService.getTaskItems(this.projectId, this.projectType)
      // await this.projectService.getTaskDocumentalChecklist(this.projectId,this.projectType)
    }
    this.loaderService.hide();
  }

  async handleChangeEvidence(event: any) {
    this.evidenceType = event.detail.value;
    // await this.storageProjectService.saveProgress(
    //   this.evidenceType,
    //   'evidenceType'
    // );
  }
  changeSelectedPage(evento: number): void {
    this.currentPage = evento;
    this.selectedOption = evento - 1;
  }

  showSelectedPage(): void {
    this.currentPage = this.selectedOption + 1;
    this.setProgresSection();
  }

  setProgresSection() {
    this.currentProgress = (this.currentPage / this.totalPages) * 100;
  }

  getDocumentalAnswer(itemId: string): {} | undefined {
    const answer = this.documentalChecklistService.getSelectedItem(itemId);
    return answer ? answer.answer : undefined;
  }

  async setAnswerYesDocumental(idItemChecklist: number, answer: any, description: any = "") {
    setTimeout(() => {
      this.documentalChecklistService.setSelectedItem(idItemChecklist, answer, description);
    }, 0);
    await this.progressService.setData('documentalProgress', this.documentalChecklistService.getAllItems());
  }

  setOpenNoAnswerDocumentalModal(isOpen: boolean, id: number) {
    this.documentalModalService.show(id)
  }

  getSelectedOptionsProducts(event: any, index: any) {
    const questions_ids = event.detail.value;
    Object.keys(this.productsDocumntalChecklistAnswers).forEach(
      (element: any) => {
        if (questions_ids.includes(element)) {
          if (this.productsDocumntalChecklistAnswers[element].answer) {
            this.documentalChecklistService.setSelectedItem(element, 'yes', '');
            this.productsDocumntalChecklistAnswers[element].answer = true;
          }
        } else {
          this.documentalChecklistService.setSelectedItem(element, 'no', '');
          this.productsDocumntalChecklistAnswers[element].answer = false;
        }
      }
    );
  }

  getSelectedOptionsTechnicians(event: any, index: any) {
    const questions_ids = event.detail.value;
    Object.keys(this.techniciansDocumntalChecklistAnswers).forEach(
      (element: any) => {
        if (questions_ids.includes(element)) {
          if (this.techniciansDocumntalChecklistAnswers[element].answer) {
            this.documentalChecklistService.setSelectedItem(element, 'yes', '');
            this.techniciansDocumntalChecklistAnswers[element].answer = true;
          }
        } else {
          this.documentalChecklistService.setSelectedItem(element, 'no', '');
          this.techniciansDocumntalChecklistAnswers[element].answer = false;
        }
      }
    );
  }
  getSelectedProjectItem(itemId: number) {
    const project = this.taskChecklistService.getTaskItemById(itemId);
    return project ? project : false;
  }

  async openModalTask(taskId: any, taskNumber: any, taskControl: any) {
    this.loaderService.show()
    this.taskModalService.show({ taskId, taskNumber, taskControl })
    this.loaderService.hide()
  }

  toggleItem(index: number) {
    if (this.selectedItem === index) {
      this.selectedItem = null;
    } else {
      this.selectedItem = index;
    }
  }

  isItemOpen(index: number): boolean {
    return this.selectedItem === index;
  }

  async setUrlImage(evidenceImage: string, folder: string) {
    if (this.networkService.getNetworkStatus()) {
      const blob = this.projectService.dataUrlToBlob(evidenceImage);
      return await this.projectService.uploadImage(blob, folder);
    } else {
      return evidenceImage
    }
  }

  canBeSent() {
    const isTheTaskChecklistComplete = this.taskChecklistService.getLength() == this.tasksData.length
    const isTheDocumentalChecklistComplete = this.documentalChecklistService.getLength() == this.totalDocumentalItems
    if (!isTheTaskChecklistComplete) {
      this.toastService.presentToast('Faltan tareas por completar', 'danger')
      return
    }
    if (!isTheDocumentalChecklistComplete) {
      this.toastService.presentToast('Faltan reactivos en el documental', 'danger')
      return
    }
    this.submitService.show(this.evidenceType)

  }

  async haveIncidents(subsidiaryId: string) {
    if (this.networkService.getNetworkStatus()) {
      return await this.validateIfHaveIncidentsOnline(subsidiaryId)
    } else {
      this.validateIfHaveIncidentsOffline(subsidiaryId)
    }
  }

  async validateIfHaveIncidentsOnline(subsidiaryId: string) {
    return await this.ticketsService.HaveIncidents(subsidiaryId)
  }

  validateIfHaveIncidentsOffline(subsidiaryId: string) {

  }

  seeIncidents() {
    this.router.navigate(['/members', 'tickets'], {
      queryParams: {
        subsidiaryId: this.subsidiaryId
      },
    });
  }

  openSelectUvMeasure(isOpen: boolean, indexTask: number) { }

  showModalAddMinuteItem(status: boolean) { }

}
