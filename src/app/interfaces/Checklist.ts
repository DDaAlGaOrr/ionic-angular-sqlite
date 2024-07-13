export interface ChecklistAnswer {
  id: number;
  answer: string;
  description: string;
  urlImage: string;
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

export interface DocumentalData {
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

