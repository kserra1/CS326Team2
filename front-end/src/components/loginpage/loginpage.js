import { BaseComponent } from "../basecomponent/basecomponent";

export default class LoginPage extends BaseComponent{
  constructor() {
    super();
    this.isLogin = true;
    this.loadCSS("loginpage");
  }

  togglePage() {
    this.isLogin = !this.isLogin;
    document.getElementById("app").innerHTML = this.render();
    this.addEventListeners();
  }

  render() {
    return `
            <div class="login-container">
                <h2>${this.isLogin ? "Login" : "Register"}</h2>
                <form>
                    <div>
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div>
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    ${!this.isLogin? `
                        <div>
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required>
                        </div>`
                        : ""
                    }
                    <button type="submit">${this.isLogin ? "Login" : "Register"}</button>
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
  }
}
