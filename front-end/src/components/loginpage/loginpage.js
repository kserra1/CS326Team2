import { BaseComponent } from "../basecomponent/basecomponent.js";
import { User } from "./user.js";

export default class LoginPage extends BaseComponent {
  constructor(recipeService, submitCallback) {
    super();
    this.isLogin = true;
    this.recipeService = recipeService;
    this.loadCSS("loginpage");
    this.currentuser = null;
    this.submitCallback = submitCallback;
    this.registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  }

  togglePage() {
    this.isLogin = !this.isLogin;
    document.getElementById("app").innerHTML = this.render();
    this.addEventListeners();
  }

async  handleFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = this.isLogin ? null : document.getElementById("email").value;

    if (!this.isLogin) { 
      const response = await this.registerUser(username, password, email);
      if(response.status===201){
        this.currentuser = new User(username, password, email);
        if(typeof this.submitCallback === 'function'){
          this.submitCallback(this.currentuser);
        }
      }else{
        alert('User already exists');
      }
        
  }else{
    const response = await this.loginUser(username, password, email);
    if(response.status===201){
      const pass = response.password;
      let username = response.username;
      const email = response.email;
      const user = { username, pass, email, loggedIn: true };
      await this.recipeService.addUser(user);
      this.currentuser = new User(username, password, email);
      if(typeof this.submitCallback === 'function'){
        this.submitCallback(this.currentuser);
      }
      alert('Login successful');
      window.location.hash = '#community-recipes';
  }else{
    alert("Failed to login. Please check your username and password");
  }
  }
}

async registerUser(username, password, email){
  try {
    const response = await fetch("http://localhost:3260/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    });
    const data = await response.json();
    alert('User registered successfully Login to continue');
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    return {success: false, message: "Error registering user"};
  }
}

async loginUser(username, password){
  try {
    const response = await fetch("http://localhost:3260/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
  } catch (error) {
    console.error("Error logging in user:", error);
    return {success: false, message: "Error logging in user"};
  }
}




  render() {
    return `
      <div class="main-content"> <!-- Add this wrapper -->
        <div class="login-container">
          <h2 class="header">${this.isLogin ? "Login" : "Register"}</h2>
          <form id="loginForm" class="card">
            <div class="input-group">
              <label for="username">Username:</label>
              <input type="text" id="username" name="username" class="form-control" required>
            </div>
            <div class="input-group">
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" class="form-control" required>
            </div>
            ${
              !this.isLogin
                ? `
                <div class="input-group">
                  <label for="email">Email:</label>
                  <input type="email" id="email" name="email" class="form-control" required>
                </div>`
                : ""
            }
            <button type="submit" class="btn btn-primary">${this.isLogin ? "Login" : "Register"}</button>
          </form>
          <button id="toggleButton" class="btn-toggle">${this.isLogin ? "Switch to Register" : "Switch to Login"}</button>
        </div>
      </div>
    `;
  }

  
  addEventListeners() {
    document
      .getElementById("toggleButton")
      ?.addEventListener("click", () => this.togglePage());
    document
      .getElementById("loginForm")
      ?.addEventListener("submit", (e) => this.handleFormSubmit(e));
  }
}

//recommit
