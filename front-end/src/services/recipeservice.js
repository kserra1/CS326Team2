import EventHub from "../eventhub/EventHub.js";

export default class RecipeService {
  //rewriting this class
  constructor() {
    //this class will be a db service, connecting to databases
    this.dbname = "recipesDB"; //this is dbname
    this.storeName = "recipes"; //store is the table name
    //indexedDB will return a new db object, and we will also have to
    //give it some schema

    this.db = null; //a new RecipeService object will return a new db
    //we need to init it first

    this.eventHub = new EventHub(); //essentially this object will just be
    //used to troubleshoot if something goes wrong
  }
  async initDB() {
    //basic code taken from last project
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
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject("Error initializing IndexedDB");
      };
    });
  }

  //I just follow the same pattern above for below methods
  async addRecipe(recipeData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
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
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readonly");
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
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readonly");
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
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
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

