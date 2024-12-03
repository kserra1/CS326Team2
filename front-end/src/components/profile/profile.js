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

    async init(){
        await this.fetchUserProfile();
    }

    async fetchUserProfile(){
        if (!this.user) {
            console.error('No user profile available');
            return;
        }
        const token = this.user.token || localStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:3260/v1/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if(!response.status === 201){
                throw new Error('Failed to fetch user profile');
            }
            const data = await response.json();
            this.user.username = data.username;
            this.user.email = data.email;
            this.render()
        }catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    }

    async onLogout(){
        console.log("Logging out")
        this.user = null;
        await this.recipeService.logout();
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
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