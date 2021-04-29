import React from "react";
import * as SQLite from "expo-sqlite";
import { SQLError } from "expo-sqlite";
import { Asset } from "expo-asset";
import EncriptService from "./security";
import mongo from "./mongo";

const db = SQLite.openDatabase("quiz.db");

const sqlProvider = {

  raw: {
    category: [
      "CREATE TABLE IF NOT EXISTS [category] ([pkCategory] INTEGER PRIMARY KEY, [name] VARCHAR NULL, [triviaApiKey] INT NULL );",
      "SELECT * FROM category",
      "INSERT INTO category ([name], [triviaApiKey] ) VALUES ('General Knowledge',9), ('Books',10), ('Film',11), ('Music',12), ('Musicals & Theatres',13), ('Television',14), ('Video Games',15), ('Board Games',16), ('Nature',17), ('Computers',18), ('Mathematics',19), ('Mythology',20), ('Sports',21), ('Geography',22), ('History',23), ('Politics',24), ('Art',25), ('Celebrities',26), ('Animals',27), ('Vehicles',28), ('Comics',29), ('Gadgets',30), ('Japanese Anime & Manga',31), ('Cartoon & Animations',32)",
    ],
    config: [
      "CREATE TABLE IF NOT EXISTS [config] ( [pkConfig] INTEGER PRIMARY KEY, [minQuestions] INT NULL, [maxQuestions] INT NULL, [timeLimit] INT NULL );",
      "SELECT * FROM config",
      "INSERT INTO config (	[minQuestions],	[maxQuestions],	[timeLimit])VALUES(10,50,900000);",
    ],
    difficulty: [
      "CREATE TABLE IF NOT EXISTS [difficulty] ([pkDifficulty] INTEGER PRIMARY KEY,	[scoreMultiplier] REAL NULL,	[name] VARCHAR NULL,[triviaApiKey] VARCHAR NULL	);",
      "SELECT * FROM difficulty",
      "INSERT INTO difficulty ([scoreMultiplier],[name],[triviaApiKey]) VALUES(1.0,'Easy','easy'),(1.5,'Medium','medium'),(3.0,'Hard','hard');",
    ],
    user: [
      "CREATE TABLE IF NOT EXISTS [user] ([pkUser] INTEGER PRIMARY KEY, [email] VARCHAR, [password] VARCHAR)",
      "SELECT * from user",
      "INSERT INTO user (email, password) VALUES (?,?)",
    ],
  },
  /**
   *
   * @param {any} tx - transaction
   * @param {string} sql - sql statement
   * @param {any[]} args - args
   */
  execute: function (tx, sql, args = []) {
    return new Promise(resolve => {
      tx.executeSql(sql, args.length ? args : null, (tx, results) =>
        resolve([tx, results])
      );
    });
  },
  /**
   *
   * @param {string} entry
   */
  initTable: async function (tx, entry) {
    console.log(entry);
    const [createTable, select, insert] = this.raw[entry];
    await this.execute(tx, createTable);
    console.log(entry, "created");
    const [, selected] = await this.execute(tx, select);
    if ("rows" in selected && selected.rows.length == 0) {
      const args = [];
      if (entry == "user") {
        args.push(
          "user@gmail.com",
          "U2FsdGVkX1+PtA+ujxsiJWCJUI8R2hTlurhb1wE3x1E="
        );
      }
      await this.execute(tx, insert, args);
      console.log(entry, "inserted");
    }
  },
  initDb: function () {
    return new Promise(resolve => {
      db.transaction(
        async tx => {
          await Promise.all(
            Object.keys(this.raw).map(k => this.initTable(tx, k))
          );
          resolve(true);
        },
        err => {
          console.error(err);
          resolve(false);
        }
      );
    });
  },
  /**
   * 
   * @param {{sql: string, args?: any[]}[]} queries 
   * @description dependant queries must be in order!
   */
  executeTransaction: function (queries = []) {
    return new Promise(resolve => {
      db.transaction(
        async tx => {
          const results = [];
          for (const q of queries) {
            results.push(await this.execute(tx, q.sql, q.args || []));
          }
          resolve(results);
        },
        err => {
          console.error(err);
          reject(err);
        }
      );
    });
  },
  getResults: function (resultSet, one = false) {
    if(resultSet) {
      return one == false? resultSet[1].rows : resultSet[1].rows[0];
    }
    return null;
  }
};


const DbContext = React.createContext({
  db: db,
  sqliteService: sqlProvider,
  moDb: mongo
});

export const DbProvider = DbContext.Provider;
export const DbConsumer = DbContext.Consumer;
export default DbContext;
