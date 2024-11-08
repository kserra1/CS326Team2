import { BaseComponent } from "../basecomponent/basecomponent.js";


export default class Profile extends BaseComponent {
    constructor(recipeService) {
        super();
        this.recipeService = recipeService;
        this.loadCSS('profile');
    }
    render() {
        return `
        <div class="profile">
            <h2>My Profile</h2>
            <p>Username: MyUsername</p>
            <p>Email: email@gmail.com</p>
            <p>Location: Massachusetts Amherst</p>
            <p>Favorite Recipe: Chicken Parm</p>
            </div>
        `;
    }
}