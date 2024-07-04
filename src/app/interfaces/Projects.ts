export interface Event {
    start: Date;
    end: Date;
    title: string;
    description: string;
    id: string;
    project_id: string;
    rel_type: string;
    color: string;
}

export interface Activities {
    projectData: any[];
    projects: any[];
    taskData: any[];
}