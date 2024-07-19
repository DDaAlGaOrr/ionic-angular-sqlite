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
                `ALTER TABLE users ADD COLUMN lastname TEXT;`,
            ]
        },
        {
            toVersion: 5,
            statements: [
                `ALTER TABLE users ADD COLUMN id_sipoc INTEGER;`,
            ]
        },
        {
            toVersion: 6,
            statements: [
                `ALTER TABLE users ADD COLUMN password TEXT;`,
            ]
        },
        {
            toVersion: 7,
            statements: [
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
                `
            ]

        },
        {
            toVersion: 8,
            statements: [
                `ALTER TABLE tblclients ADD COLUMN company TEXT;`,
            ]
        },
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
