import { BaseComponent } from "../basecomponent/basecomponent.js";


export default class Profile extends BaseComponent {
    constructor(recipeService,user) {
        super();
        this.recipeService = recipeService;
        this.loadCSS('profile');
        this.user = user;
    }
    setupEventListeners() {
        console.log("Setting up event listeners")
        const logoutButton = document.getElementById('logoutButton');
        if(logoutButton){
        logoutButton.addEventListener('click',async () => {
           await this.onLogout();      
        });
    }
    }
    async onLogout(){
        console.log("Logging out")
        this.user = null;
        await this.recipeService.logout();
        localStorage.removeItem('user');
        window.location.hash = '#login';
    }
    render() {
        if (!this.user) {
            return `<h2>No user profile available</h2>`;
        }

        return `
        <div class="profile">
            <h2>My Profile</h2>
            <p>Username: ${this.user.username}</p>
            <p>Email: ${this.user.email}</p>
            <button id="logoutButton" class="logout-button">Logout</button>
            </div>
        `;
    }
}