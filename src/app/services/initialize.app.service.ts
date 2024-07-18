import { Injectable } from '@angular/core';

import { SqliteService } from './sqlite.service';
import { StorageService } from './storage.service';
import { ChecklistSectionService } from './offline/checklist-section.service';
import { SubsidiaryClientService } from './offline/subsidiary-client.service';
import { ClientsService } from './offline/clients.service';
import { ProjectsService } from './offline/projects.service';
import { TasksService } from './offline/tasks.service';
import { ContractsTypeService } from './offline/contracts-type.service';
import { Toast } from '@capacitor/toast';

@Injectable()
export class InitializeAppService {
    isAppInit: boolean = false;
    platform!: string;

    constructor(
        private sqliteService: SqliteService,
        private storageService: StorageService,
        private checklistSectionService: ChecklistSectionService,
        private subsidiaryClientService: SubsidiaryClientService,
        private clientsService: ClientsService,
        private projectService: ProjectsService,
        private tasksService: TasksService,
        private contractsTypeService: ContractsTypeService,
    ) {

    }

    async initializeApp() {
        await this.sqliteService.initializePlugin().then(async (ret) => {
            this.platform = this.sqliteService.platform;
            try {
                if (this.sqliteService.platform === 'web') {
                    await this.sqliteService.initWebStore();
                }
                // Initialize the myuserdb database
                const DB_USERS = 'myuserdb'
                await this.storageService.initializeDatabase(DB_USERS);
                await this.checklistSectionService.initializeDatabase(DB_USERS)
                await this.subsidiaryClientService.initializeDatabase(DB_USERS)
                await this.clientsService.initializeDatabase(DB_USERS)
                await this.projectService.initializeDatabase(DB_USERS)
                await this.tasksService.initializeDatabase(DB_USERS)
                await this.contractsTypeService.initializeDatabase(DB_USERS)
                // Here Initialize MOCK_DATA if required

                // Initialize whatever database and/or MOCK_DATA you like

                if (this.sqliteService.platform === 'web') {
                    await this.sqliteService.saveToStore(DB_USERS);
                }

                this.isAppInit = true;

            } catch (error) {
                console.log(`initializeAppError: ${error}`);
                await Toast.show({
                    text: `initializeAppError: ${error}`,
                    duration: 'long'
                });
            }
        });
    }
}