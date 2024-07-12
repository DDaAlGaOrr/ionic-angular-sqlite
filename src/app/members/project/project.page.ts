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

import { DocumentalChecklistService } from '../../services/documental-checklist.service';
import { NetworkService } from '../../services/network.service';
import { ProjectService } from '../../services/project.service';
import { LoaderService } from '../../services/loader.service';
import { PlanDetail } from 'src/app/interfaces/Checklist';



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
  openDocumentModal: boolean = false
  documentChecklistItemId: number = 0
  evidenceImageDocumental: string = ""
  reasonDocumentalAnswer: string = ""
  projectType: string = '';
  projectId: number = 0;



  constructor(
    private documentalChecklistService: DocumentalChecklistService,
    private networkService: NetworkService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private fb: NonNullableFormBuilder,
    private loaderService: LoaderService,
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
      const planDetail: PlanDetail = await this.projectService.getProjectTasks(this.projectId, this.projectType) as PlanDetail
      this.tasksData = planDetail.tasksData
      this.clientName = planDetail.clientName
      this.subsdiaryName = planDetail.subsdiaryName
      this.planName = planDetail.planName
      this.checklistItems = planDetail.checklistItems
      this.tasksBelts = planDetail.formattedTask.tasksBelts
      this.formattedTasks = planDetail.formattedTask.formattedTasks
    } else {
      await this.projectService.getTaskItems(this.projectId, this.projectType)
    }
    // this.projectService.getDocumentalChecklist(this.projectId,this.projectType)
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
    this.currentPage = this.selectedOption + 1;
    this.setProgresSection();
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

  async setAnswerDocumental(
    idItemChecklist: number,
    answer: any,
    description: any = ""
  ) {
    setTimeout(() => {
      this.documentalChecklistService.setSelectedItem(
        idItemChecklist,
        answer,
        description
      );
    }, 0);
    console.log(this.documentalChecklistService.getAllItems())
    // await this.storageProjectService.saveProgress(
    //   this.checklistService.getAllItems(),
    //   'documentalProgress'
    // );
  }

  setOpenModalDocumental(isOpen: boolean, id: number) {
    this.openDocumentModal = isOpen;
    this.documentChecklistItemId = id;
  }

  closeDocumentalModal(isOpen: boolean) {
    this.openDocumentModal = isOpen;
  }

  async setDocumentalAnswerNo(isOpen: boolean) {
    let url = this.evidenceImageDocumental.length > 0 ? await this.setUrlImage(this.evidenceImageDocumental, 'documentalEvidence') || "" : ''
    this.documentalChecklistService.setSelectedItem(
      this.documentChecklistItemId,
      'no',
      this.reasonDocumentalAnswer,
      url
    );
    this.reasonDocumentalAnswer = '';
    this.evidenceImageDocumental = '';
    this.openDocumentModal = isOpen;

    // await this.storageProjectService.saveProgress(
    //   this.checklistService.getAllItems(),
    //   'documentalProgress'
    // );
    // console.log(
    //   await this.storageProjectService.getDataBykey('documentalProgress')
    // );
    // console.log(this.checklistService.getAllItems());
  }

  getSelectedOptionsProducts(event: any, index: any) {
    // const questions_ids = event.detail.value;
    // Object.keys(this.productsDocumntalChecklistAnswers).forEach(
    //   (element: any) => {
    //     if (questions_ids.includes(element)) {
    //       if (this.productsDocumntalChecklistAnswers[element].answer) {
    //         this.checklistService.setSelectedItem(element, 'yes', '');
    //         this.productsDocumntalChecklistAnswers[element].answer = true;
    //       }
    //     } else {
    //       this.checklistService.setSelectedItem(element, 'no', '');
    //       this.productsDocumntalChecklistAnswers[element].answer = false;
    //     }
    //   }
    // );
  }
  getSelectedOptionsTechnicians(event: any, index: any) {
    // const questions_ids = event.detail.value;
    // Object.keys(this.techniciansDocumntalChecklistAnswers).forEach(
    //   (element: any) => {
    //     if (questions_ids.includes(element)) {
    //       if (this.techniciansDocumntalChecklistAnswers[element].answer) {
    //         this.checklistService.setSelectedItem(element, 'yes', '');
    //         this.techniciansDocumntalChecklistAnswers[element].answer = true;
    //       }
    //     } else {
    //       this.checklistService.setSelectedItem(element, 'no', '');
    //       this.techniciansDocumntalChecklistAnswers[element].answer = false;
    //     }
    //   }
    // );
  }

  showModalTaskAnswerNo(
    open: boolean,
    item_id: any,
    index: any,
    isRnp: any = false
  ) {
    // this.currentTaskChecklistItem = item_id;
    // if (isRnp) {
    //   this.showTicketsModal(true);
    // } else {
    //   this.modalTaskAnswerNo = open;
    // }
  }

  getSelectedProjectItem(itemId: string) {
    // const project = this.projectService.getSelectedItem(itemId);
    // return project ? project : false;
    return true
  }

  async openModalTask(id_task: any, number_task: any, control: any) {
    // this.id_task = id_task;
    // this.task_control = control;
    // this.task_number = number_task;
    // this.httpService
    //   .get(`staffs/${id_task}/checklist`, true)
    //   .then((observableResult) => {
    //     observableResult.subscribe(
    //       (response: any) => {
    //         this.checklist = response.items;
    //         this.checklist_id = response.checklist[0].id;
    //         this.taskStatus =
    //           response.status_task != null ? response.status_task.content : 0;
    //         this.checklist.forEach((item) => {
    //           this.checklistTaskService.setSelectedItem(
    //             item.id,
    //             'yes',
    //             '',
    //             '',
    //             false,
    //             ''
    //           );
    //         });
    //       },
    //       (error: any) => {
    //         console.error('Error al enviar datos:', error);
    //         // Puedes manejar el error aquí
    //       }
    //     );
    //   })
    //   .catch((error) => {
    //     console.error('Error al realizar la solicitud de calendar:', error);
    //     // Puedes manejar el error aquí
    //   });
    // this.openTaskModal = true;
    // return this.modal.present(); // Mostrar el modal
  }

  toggleItem(index: number) {
    // if (this.selectedItem === index) {
    //   // Si ya está seleccionado, ciérralo
    //   this.selectedItem = null;
    // } else {
    //   // Si es diferente al seleccionado, ábrelo y cierra los demás
    //   this.selectedItem = index;
    // }
  }

  isItemOpen(index: number): boolean {
    // return this.selectedItem === index;
    return true
  }

  async setUrlImage(evidenceImage: string, folder: string) {
    if (this.networkService.getNetworkStatus()) {
      const blob = this.projectService.dataUrlToBlob(evidenceImage);
      return await this.projectService.uploadImage(blob, folder);
    } else {
      return this.evidenceImageDocumental
    }
  }

}
