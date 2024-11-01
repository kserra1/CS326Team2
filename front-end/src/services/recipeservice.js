import EventHub from "../eventhub/EventHub.js";

export default class RecipeService {
  constructor() {
    this.dbName = "recipesDB"; //this is the name of db
    this.storeName = "recipes"; //this is name of table
    this.db = null;
    this.eventHub = new EventHub();
  }

  // Initializes IndexedDB if not already initialized
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db); //promise will return db obj
      };

      request.onerror = (event) => {
        reject("Error initializing IndexedDB");
      };
    });
  }

  // Ensures DB is initialized before performing an operation
  async getDB() {
    if (!this.db) {
      await this.initDB();
    }
    return this.db;
  }

  //all the methods below will first make sure db exists
  //that way we aren't accessing null/void elements

  async addRecipe(recipeData) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.add(recipeData);

      request.onsuccess = () => {
        this.eventHub.emit("RecipeAdded", recipeData);
        resolve("Recipe added successfully");
      };

      request.onerror = () => {
        reject("Error adding recipe");
      };
    });
  }

  async getAllRecipes() {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = (event) => {
        const recipes = event.target.result;
        this.eventHub.emit("RecipesLoaded", recipes);
        resolve(recipes);
      };

      request.onerror = () => {
        reject("Error retrieving recipes");
      };
    });
  }

  async getRecipeById(id) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = (event) => {
        const recipe = event.target.result;
        this.eventHub.emit("RecipeLoaded", recipe);
        resolve(recipe);
      };

      request.onerror = () => {
        reject("Error retrieving recipe");
      };
    });
  }

  async deleteRecipe(id) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        this.eventHub.emit("RecipeDeleted", id);
        resolve("Recipe deleted successfully");
      };

      request.onerror = () => {
        reject("Error deleting recipe");
      };
    });
  }
}
