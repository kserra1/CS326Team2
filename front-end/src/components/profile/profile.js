export default class Profile {
    constructor(user){
        this.user = user;
    }

    render() {
        if (!this.user) {
            return `<h2>No user profile available</h2>`;
        }

        return `
            <h2>My Profile</h2>
            <p>Username: ${this.user.username}</p>
            <p>Email: ${this.user.email}</p>
            <p>Location: Massachusetts Amherst</p>
            <p>Favorite Recipe: Chicken Parm</p>
        `;
    }
}