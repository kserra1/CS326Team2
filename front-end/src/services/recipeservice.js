import EventHub from "../eventhub/EventHub.js";

export default class RecipeService {
  constructor(mockRecipes = []) {
    this.dbName = "recipesDB"; //this is the name of db
    this.storeName = "recipes"; //this is name of table
    this.userStoreName = "users";
    this.db = null;
    this.recipes = [];
    this.eventHub = new EventHub();
    this.initDB()
    .then(async () => {
      const recipes = await this.getAllRecipes();
      if (recipes.length === 0) {
        mockRecipes.forEach((recipe) => {
          this.addRecipe(recipe);
        });
      }
    })    
    .catch((error) => {
      console.error(error);
    });
  }

  // Initializes IndexedDB if not already initialized
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 2);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains(this.userStoreName)) {
          db.createObjectStore(this.userStoreName, {
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
        console.log("Error initializing IndexedDB");
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
  async addRecipe(data) {
    const db = await this.getDB();
    const recipeData = await data

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.add(recipeData);

      request.onsuccess = () => {
        this.eventHub.emit("RecipeAdded", recipeData);
        resolve("Recipe added successfully");
      };

      request.onerror = () => {
        this.eventHub.emit("RecipeAddError", recipeData);
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
        const recipess = event.target.result;
        this.eventHub.emit("RecipesLoaded", recipess);
        resolve(recipess);
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

  async addUser(userData){
    const db = await this.getDB();
    return new Promise((resolve, reject)=>{
      const transaction = db.transaction([this.userStoreName], "readwrite");
      const store = transaction.objectStore(this.userStoreName);
      const request = store.add(userData);

      request.onsuccess = ()=>{
        resolve("User added successfully");
      }

      request.onerror = ()=>{
        reject("Error adding user");
      }
    })
  }

  async getUserById(id){
    const db = await this.getDB();
    return new Promise((resolve, reject)=>{
      const transaction = db.transaction([this.userStoreName], "readonly");
      const store = transaction.objectStore(this.usersStoreName);
      const request = store.get(id);
      request.onsuccess = (event)=>{
        const user = event.target.result;
        resolve(user);
      }
      request.onerror = ()=>{
        reject("Error retrieving user");
      }
    }
    )
  }



  async getLoggedInUser() {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.userStoreName], "readonly");
      const store = transaction.objectStore(this.userStoreName);
      const request = store.getAll();

      request.onsuccess = (event) => {
        const users = event.target.result;
        const loggedInUser = users.find((user) => user.loggedIn);
        resolve(loggedInUser || null);
      };

      request.onerror = () => reject("Error fetching logged-in user");
    });
  }






  async searchRecipes({category = null, ingredients = []}){
    const db = await this.getDB();
    return new Promise((resolve, reject)=>{
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      request.onsuccess = (event)=>{
        let recipes = event.target.result;

        if(category.toLowerCase() == "lunch"){
          recipes = recipes.filter(recipe => recipe.lunch);
        }else if(category.toLowerCase() == "dinner"){
          recipes = recipes.filter(recipe => recipe.dinner);
        }else if(category.toLowerCase() == "breakfast"){
          recipes = recipes.filter(recipe => recipe.breakfast);
        }else if(category.toLowerCase() == "snack"){
          recipes = recipes.filter(recipe => recipe.snack);
        }
        if (ingredients.length > 0){
          recipes = recipes.filter(recipe => recipe.ingredients.every(ingredients));
        }
        resolve(recipes);
      }
      request.onerror = ()=>{
        reject("Error retrieving recipes");
      }
    })

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

  async updateLikes(recipeId, newLikes){
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(recipeId);

        request.onsuccess = (event) => {
            const recipe = event.target.result;
            if (!recipe) return reject("Recipe not found");

            recipe.likes = newLikes;
            const updateRequest = store.put(recipe);
            updateRequest.onsuccess = () => resolve(recipe);
        };

        request.onerror = () => reject("Error updating likes");
    });
  }

  async logout(){
    const db = await this.getDB();
    return new Promise((resolve, reject)=>{
      const transaction = db.transaction([this.userStoreName], "readwrite");
      const store = transaction.objectStore(this.userStoreName);
      const request = store.getAll();
      request.onsuccess = (event)=>{
        const users = event.target.result;
        users.forEach(user => {
          user.loggedIn = false;
          store.put(user);
        });
        resolve("Logged out successfully");
      }
      request.onerror = ()=>{
        reject("Error logging out");
      }
    })
  }

  async addComment(recipeId, comment) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(recipeId);

        request.onsuccess = (event) => {
            const recipe = event.target.result;
            if (!recipe) return reject("Recipe not found");

            recipe.comments.push(comment);
            const updateRequest = store.put(recipe);
            updateRequest.onsuccess = () => resolve(recipe);
        };

        request.onerror = () => reject("Error adding comment");
    });
  }
}
