class PostController {
    constructor(model) {
        this.model = model; // Assume model handles database operations
    }

    // Create a new post
    async createPost(req, res) {
        const { title, content, author } = req.body;
        try {
            const newPost = await this.model.createPost(title, content, author);
            return res.status(201).json({ message: "Post created successfully", post: newPost });
        } catch (err) {
            console.error("Error creating post:", err);
            return res.status(500).json({ error: "Error creating post" });
        }
    }

    // Get a post by ID
    async getPost(req, res) {
        const { postId } = req.params;
        try {
            const post = await this.model.getPostById(parseInt(postId, 10));
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            return res.status(200).json({ post });
        } catch (err) {
            console.error("Error fetching post:", err);
            return res.status(500).json({ error: "Error fetching post" });
        }
    }

    // Increment likes for a post
    async likePost(req, res) {
        const { postId } = req.body;
        try {
            const post = await this.model.getPostById(postId);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }

            const updatedPost = await this.model.updateLikes(postId, post.likes + 1);
            return res.status(200).json({ message: "Post liked successfully", post: updatedPost });
        } catch (err) {
            console.error("Error liking post:", err);
            return res.status(500).json({ error: "Error liking post" });
        }
    }

    // Add a comment to a post
    async addComment(req, res) {
        const { postId, comment } = req.body;
        try {
            const updatedPost = await this.model.addComment(postId, comment);
            if (!updatedPost) {
                return res.status(404).json({ error: "Post not found" });
            }
            return res.status(200).json({ message: "Comment added successfully", post: updatedPost });
        } catch (err) {
            console.error("Error adding comment:", err);
            return res.status(500).json({ error: "Error adding comment" });
        }
    }

    
    // Delete a post by ID
async deletePost(req, res) {
    const { postId } = req.params;
    try {
        const post = await this.model.getPostById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        await this.model.deletePost(postId);
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json({ error: "Error deleting post" });
    }
}

    // Get all posts
    async getAllPosts(req, res) {
        try {
            const posts = await this.model.getAllPosts();
            return res.status(200).json({ posts });
        } catch (err) {
            console.error("Error fetching posts:", err);
            return res.status(500).json({ error: "Error fetching posts" });
        }
    }
}

export default PostController;