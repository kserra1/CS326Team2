import { BaseComponent } from "../basecomponent/basecomponent.js";


export default class Profile extends BaseComponent {
    constructor(recipeService,user) {
        super();
        this.recipeService = recipeService;
        this.loadCSS('profile');
        this.user = user;
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
            </div>
        `;
    }
}