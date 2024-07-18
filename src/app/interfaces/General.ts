export interface SubsidiaryClient {
    id: number;
    code_client: string;
    client_parent: number;
    id_hh: number;
    id_subsidiary: string;
    client_name: string;
    address: string;
    state: string;
    zone: string;
    reg: string;
    dirreg: string;
}

export interface Client {
    userid: number;
    company: string;
    code_client: string;
    state: string;
    address: string;
    type_client: string;
    active: number;
    zone: string
}

export interface Project {
    id: number;
    name: string;
    status: number;
    clientid: number;
    subsidiary_id: string;
    client_name: string;
    start_date: string;
    deadline: string;
    project_created: string;
    addedfrom: number;
    zone: string;
    name_zone: string;
    assigned: number;
}

export interface Task {
    id: number;
    folio_number: string;
    name: string;
    group_control: number;
    dateadded: string;
    startdate: string;
    subsidiary_id: string;
    uv_task: number;
    cinturon: string;
    duedate: string;
    addedfrom: number;
    status: number;
    rel_id: number;
    rel_type: string;
    type_task: string;
}

export interface ContractsTypes {
    id: number;
    name: string
}

export interface ProjectsItems {
    id: number;
    cinturon: string;
    grupo_control: number;
    porcentaje: number;
    project_id: number;
    total_tasks: number;
}