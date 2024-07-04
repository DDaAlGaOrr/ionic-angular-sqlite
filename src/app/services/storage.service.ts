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
        console.log(users)
    }
    // CRUD Operations
    async getUsers() {
        await this.loadUsers();
        this.isUserReady.next(true);
    }
    async addUser(id: number, email: string, firstname: string, lastname: string, password: string) {
        const sql = `INSERT INTO users (name,email,firstname,lastname,password,id_sipoc) VALUES (?,?,?,?,?,?);`;
        await this.db.run(sql, [firstname, email, firstname, lastname, password, id]);
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
    async clearUserTable(){
        const sql = `DELETE FROM users`;
        await this.db.run(sql);
    }
}
