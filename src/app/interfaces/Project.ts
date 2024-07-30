export interface planDetail {
    client: string
    folio: string
    id_subsidiary: string
    subsidiary: string
}

export interface openNoAnswerDocumentModal {
    open: boolean
    description: string
    urlImage: string;
    checklistItemId: number
}

export interface submitProject {
    rel_id: number
    rel_type: string
    id_checklist: number
    checklist_answers: {}
    signaturePicture: string
    tasksAnswers: {}
    evidenceType: number
    namesignature: string,
    lastnamesignature: string,
    emailsignature: string,
    staff_id: number,
}