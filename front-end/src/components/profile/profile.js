import { BaseComponent } from "../basecomponent/basecomponent.js";


export default class Profile extends BaseComponent {
    constructor(recipeService) {
        super();
        this.recipeService = recipeService;
        this.loadCSS('profile');
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
            <p>Location: Massachusetts Amherst</p>
            <p>Favorite Recipe: Chicken Parm</p>
            </div>
        `;
    }
}