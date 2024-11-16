import { BaseComponent } from "../basecomponent/basecomponent.js";
import { User } from "./user.js";

export default class LoginPage extends BaseComponent {
  constructor(submitCallback) {
    super();
    this.isLogin = true;
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

  handleFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = this.isLogin ? null : document.getElementById("email").value;

    if (!this.isLogin) { 
        const existingUser = this.registeredUsers.find(user => user.username === username);
        if (existingUser) {
            alert("This username is already registered. Please log in.");
            return;
        }

        
        this.currentuser = new User(username, password, email);
        this.registeredUsers.push(this.currentuser);
        localStorage.setItem('registeredUsers', JSON.stringify(this.registeredUsers)); 

        alert("Registration successful!");
        if (typeof this.submitCallback === "function") {
            this.submitCallback(this.currentuser);
        }
    } else { 
        const existingUser = this.registeredUsers.find(user => user.username === username && user.password === password);
        
        if (existingUser) {
            this.currentuser = existingUser; 
            alert("Login successful!");
            if (typeof this.submitCallback === "function") {
                this.submitCallback(this.currentuser);
            }
        } else {
            alert("Failed to login. Please check your username and password.");
        }
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
