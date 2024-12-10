class InMemoryPostModel {
    constructor() {
        this.posts = []; // Array to hold posts
        this.currentId = 1; // Simulate auto-increment IDs
    }

    // Create a new post
    async createPost(title, content, author) {
        const post = {
            id: this.currentId++,
            title,
            content,
            author,
            likes: 0, // Initialize likes to 0
            comments: [] // Initialize comments as an empty array
        };
        this.posts.push(post);
        return post;
    }

    // Get a post by ID
    async getPostById(postId) {
        return this.posts.find(post => post.id === postId);
    }

    // Update likes for a post
    async updateLikes(postId, newLikes) {
        const post = await this.getPostById(postId);
        if (post) {
            post.likes = newLikes;
            return post;
        }
        return null;
    }

    // Add a comment to a post
    async addComment(postId, comment) {
        const post = await this.getPostById(postId);
        if (post) {
            post.comments.push(comment);
            return post;
        }
        return null;
    }

    // delete post by Id
    async deletePost(postId) {
        const postIndex = this.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
            const deletedPost = this.posts.splice(postIndex, 1)[0];
            return deletedPost;
        }
        return null;
    }


    // Get all posts
    async getAllPosts() {
        return this.posts;
    }
}

export default new InMemoryPostModel