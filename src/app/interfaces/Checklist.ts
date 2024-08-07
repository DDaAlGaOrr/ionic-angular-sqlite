export interface ChecklistAnswer {
  id: number;
  answer: string;
  description: string;
  urlImage: string;
}

export interface ProjectAnswers {
  rel_id: number;
  rel_type: string;
  id_checklist: string;
  checklist_answers: any;
  taskStatus: string;
  description: string;
}

export interface TaskChecklist {
  id: string;
  answer: string;
  description: string;
  urlImage: string;
  customer_responsibility: boolean;
  correctiveTaskAction: string;
}

export interface PlanDetail {
  tasksData: TaskData[];
  clientName: string;
  subsdiaryName: string;
  planName: string;
  checklistItems: string;
  formattedTask: FormattedTask;
  projectType: string,
  uvChecklistItems: {}
  subsidiaryId: string,
  uvTotalTasks: TasksGroup
}

export interface TaskData {
  belt: string;
  description: string
  duedate: Date
  folio_number: number
  group_control: number
  id: number
  name: number
  priority: number
  status: number
}

export interface FormattedTask {
  tasksBelts: any[]
  formattedTasks: any[]
}

interface EvaluationAnswers {
  [key: string]: any;
}

interface TechniciansDocumntalChecklistAnswers {
  [key: string]: any;
}
interface ProductsDocumntalChecklistAnswers {
  [key: string]: any;
}

export interface TasksGroup {
  [key: string]: Task[];
}
interface Task {
  id: number;
  description: string;
  cinturon: string;
}

export interface DocumentalData {
  totalDocumentalItems: number
  totalPages: number;
  evaluationAnswers: EvaluationAnswers;
  sectionListItems: any[];
  sectionList: any[];
  productsDocumntalChecklist: any[];
  techniciansDocumntalChecklist: {};
  selectedTexts: string[];
  selectedTextsTechnicians: string[];
  techniciansDocumntalChecklistAnswers: TechniciansDocumntalChecklistAnswers;
  productsDocumntalChecklistAnswers: ProductsDocumntalChecklistAnswers;
}

export interface ChecklistSections {
  id: number;
  name: string;
}

export interface ChecklistTaskForm {
  id: number;
  task_id: number,
  form_id: number,
  rel_type: string,
  answered: number,
  signature_picture: string,
  evidence_type: number
}

export interface ChecklistQuestions {
  id: number;
  id_form: number;
  form_id: number;
  id_section: number;
  id_sub_section: number,
  description: string,
}

export interface ChecklistTasks {
  id: number
  checklist_name: string
}



