import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { DbnameVersionService } from './dbname-version.service';
import { UserUpgradeStatements } from '../upgrades/user.upgrade.statements';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from '../interfaces/Auth';


@Injectable()
export class StorageService {
    public userList: BehaviorSubject<User[]> =
        new BehaviorSubject<User[]>([]);
    private databaseName: string = "";
    private uUpdStmts: UserUpgradeStatements = new UserUpgradeStatements();
    private versionUpgrades;
    private loadToVersion;
    private db!: SQLiteDBConnection;
    private isUserReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private sqliteService: SqliteService,
        private dbVerService: DbnameVersionService) {
        this.versionUpgrades = this.uUpdStmts.userUpgrades;
        this.loadToVersion = this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;
    }
    async initializeDatabase(dbName: string) {
        this.databaseName = dbName;
        // create upgrade statements
        await this.sqliteService
            .addUpgradeStatement({
                database: this.databaseName,
                upgrade: this.versionUpgrades
            });
        // create and/or open the database
        this.db = await this.sqliteService.openDatabase(
            this.databaseName,
            false,
            'no-encryption',
            this.loadToVersion,
            false
        );
        this.dbVerService.set(this.databaseName, this.loadToVersion);

        await this.getUsers();

        const createTablesSQL =
            `
            CREATE TABLE IF NOT EXISTS tbltasks(
                id INTEGER PRIMARY KEY,
                folio_number TEXT,
                name TEXT,
                group_control INTEGER,
                dateadded TEXT,
                startdate TEXT,
                subsidiary_id TEXT,
                uv_task INTEGER,
                cinturon TEXT,
                duedate TEXT,
                addedfrom INTEGER,
                status INTEGER,
                rel_id INTEGER,
                rel_type  TEXT,
                type_task TEXT
            );

            CREATE TABLE IF NOT EXISTS tblsubsidiary_client(
                id INTEGER PRIMARY KEY,
                code_client TEXT,
                client_parent INTEGER,
                id_hh INTEGER,
                id_subsidiary TEXT,
                client_name INTEGER,
                address TEXT,
                state TEXT,
                zone TEXT,
                reg TEXT,
                dirreg TEXT
            );

            CREATE TABLE IF NOT EXISTS tblprojects(
                id INTEGER PRIMARY KEY,
                name TEXT,
                status INTEGER,
                clientid INTEGER,
                subsidiary_id TEXT,
                client_name TEXT,
                start_date TEXT,
                deadline TEXT,
                project_created TEXT,
                addedfrom INTEGER,
                zone TEXT,
                name_zone TEXT,
                assigned INTEGER
            );

            CREATE TABLE IF NOT EXISTS tblprojects_items(
                id INTEGER PRIMARY KEY,
                cinturon TEXT,
                grupo_control INTEGER,
                porcentaje INTEGER,
                project_id INTEGER,
                total_tasks INTEGER
            );

            CREATE TABLE IF NOT EXISTS tblcontracts_types(
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS tblclients(
                id INTEGER PRIMARY KEY,
                code_client TEXT,
                state TEXT,
                address TEXT,
                type_client TEXT,
                active INTEGER,
                zone TEXT
            );

            CREATE TABLE IF NOT EXISTS tblchecklist_task_form(
                id INTEGER PRIMARY KEY,
                task_id INTEGER,
                form_id INTEGER,
                rel_type TEXT,
                answered INTEGER,
                signature_picture TEXT,
                evidence_type INTEGER
            );

            CREATE TABLE IF NOT EXISTS tblchecklist_sub_section(
                id INTEGER PRIMARY KEY,
                name TEXT
            );

            CREATE TABLE IF NOT EXISTS tblchecklist_section(
                id INTEGER PRIMARY KEY,
                name TEXT
            );

            CREATE TABLE IF NOT EXISTS tblchecklist_questions(
                id INTEGER PRIMARY KEY,
                id_form INTEGER,
                form_id INTEGER,
                id_section INTEGER,
                id_sub_section INTEGER,
                description TEXT
            );

        `;

        try {
            await this.db?.execute(createTablesSQL);
        } catch (e) {
            console.error('Error creating tables:', e);
        }
    }
    // Current database state
    userState() {
        return this.isUserReady.asObservable();
    }
    fetchUsers(): Observable<User[]> {
        return this.userList.asObservable();
    }

    async loadUsers() {
        const users: User[] = (await this.db.query('SELECT * FROM users;')).values as User[];
        this.userList.next(users);
    }
    // CRUD Operations
    async getUsers() {
        await this.loadUsers();
        this.isUserReady.next(true);
    }
    async addUser(id: number, email: string, firstname: string, lastname: string, password: string) {
        const sql = `INSERT INTO users (name,email,firstname,lastname,id_sipoc,password) VALUES (?,?,?,?,?,?);`;
        await this.db.run(sql, [firstname, email, firstname, lastname, id, password]);
        await this.getUsers();
    }

    async updateUserById(id: string, active: number) {
        const sql = `UPDATE users SET active=${active} WHERE id=${id}`;
        await this.db.run(sql);
        await this.getUsers();
    }
    async deleteUserById(id: number) {
        const sql = `DELETE FROM users WHERE id=${id}`;
        await this.db.run(sql);
        await this.getUsers();
    }
    async authUser(postData: Auth) {
        try {
            const query = `SELECT * FROM users WHERE email = ? AND password = ?;`;
            const params = [postData.username, postData.password];
            const result = await this.db.query(query, params);
            const users = result.values;
            if (users && users.length > 0) {
                return users[0];
            } else {
                return false;
            }

        } catch (error) {
            console.error("Error en la autenticación del usuario:", error);
            throw error;
        }
    }
    async clearUserTable() {
        const sql = `DELETE FROM users`;
        await this.db.run(sql);
    }

    async showTables() {
        const users = (await this.db.query('SELECT name, sql FROM sqlite_master WHERE type="table";')).values;
        console.log(users)
    }
}
