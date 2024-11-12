import { BaseComponent } from "../basecomponent/basecomponent.js";
import { User } from "./user.js";

export default class LoginPage extends BaseComponent {
  constructor(submitCallback) {
    super();
    this.isLogin = true;
    this.loadCSS("loginpage");
    this.currentuser = null;
    this.submitCallback = submitCallback;
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
    const email = this.login ? null : document.getElementById("email").value;

    if (!this.login) {
      this.currentuser = new User(username, password, email);
      alert("Registration successful!");
      if (typeof this.submitCallback === "function") {
        this.submitCallback(this.currentuser);
      }
    } else {
      if (
        this.currentuser &&
        this.currentuser.username == username &&
        this.currentuser.password == password
      ) {
        alert("Login successful");
        if (typeof this.submitCallback === "function") {
          this.submitCallback(this.currentuser);
        }
      } else {
        alert("Failed to login");
      }
    }
  }

  render() {
    return `
            <div class="login-container">
                <h2>${this.isLogin ? "Login" : "Register"}</h2>
                <form id="loginForm">
                    <div>
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div>
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    ${
                      !this.isLogin
                        ? `
                        <div>
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required>
                        </div>`
                        : ""
                    }
                    <button type="submit">${
                      this.isLogin ? "Login" : "Register"
                    }</button>
                </form>
                <button id="toggleButton">${
                  this.isLogin ? "Switch to Register" : "Switch to Login"
                }</button>
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
