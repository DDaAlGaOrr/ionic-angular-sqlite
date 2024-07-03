export class UserUpgradeStatements {
    userUpgrades = [
        {
            toVersion: 1,
            statements: [
                `CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            active INTEGER DEFAULT 1
            );`
            ]
        },
        /* add new statements below for next database version when required*/

        {
            toVersion: 2,
            statements: [
                `ALTER TABLE users ADD COLUMN email TEXT;`,
            ]
        },
        {
            toVersion: 3,
            statements: [
                `ALTER TABLE users ADD COLUMN firstname TEXT;`,
            ]
        },
        {
            toVersion: 4,
            statements: [
                `ALTER TABLE users ADD COLUMN lastname TEXT;
                ALTER TABLE users ADD COLUMN password TEXT;`,
            ]
        },
        {
            toVersion: 5,
            statements: [
                `ALTER TABLE users ADD COLUMN id_sipoc INTEGER;`,
            ]
        },
        // {
        //     toVersion: 3,
        //     statements: [
        //         `DROP TABLE appname_modelname;`,
        //     ]
        // },
        // {
        //     toVersion: 4,
        //     statements: [
        //         `DROP TABLE users;`,
        //     ]
        // },
        // {
        //     toVersion: 5,
        //     statements: [
        //         `CREATE TABLE IF NOT EXISTS users(
        //             id INTEGER PRIMARY KEY AUTOINCREMENT,
        //             name TEXT NOT NULL,
        //             active INTEGER DEFAULT 1
        //             );`,
        //     ]
        // },
        // {
        //     toVersion: 6,
        //     statements: [
        //         `DROP TABLE users;`,
        //     ]
        // },
        // {
        //     toVersion: 7,
        //     statements: [
        //         `CREATE TABLE IF NOT EXISTS users(
        //             id INTEGER PRIMARY KEY ,
        //             email TEXT NOT NULL,
        //             lastname TEXT NOT NULL,
        //             password TEXT NOT NULL,
        //             );`,
        //     ]
        // },
        // {
        //     toVersion: 8,
        //     statements: [
        //         `DROP TABLE users;`,
        //     ]
        // },
        // {
        //     toVersion: 9,
        //     statements: [
        //         `CREATE TABLE IF NOT EXISTS users(
        //             id INTEGER PRIMARY KEY ,
        //             email TEXT NOT NULL,
        //             firstname TEXT NOT NULL,
        //             lastname TEXT NOT NULL,
        //             password TEXT NOT NULL,
        //             );`,
        //     ]
        // },
        // {
        //     toVersion: 10,
        //     statements: [
        //         `CREATE TABLE IF NOT EXISTS users_sipoc(
        //             id INTEGER PRIMARY KEY ,
        //             email TEXT NOT NULL,
        //             firstname TEXT NOT NULL,
        //             lastname TEXT NOT NULL,
        //             password TEXT NOT NULL,
        //             );`,
        //     ]
        // },

    ]
}
