import { Sequelize, DataTypes } from "sequelize";

class SQLitePostModel {
    constructor() {
        this.init();
    }

    async init() {
        this.sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "database.sqlite",
        });

        this.Post = this.sequelize.define("Post", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            author: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            likes: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            comments: {
                type: DataTypes.JSON,
                defaultValue: [],
            },
            pinned: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        });

        await this.sequelize.sync({ force: false });
    }

    async createPost(title, content, author) {
        const post = await this.Post.create({
            title,
            content,
            author,
        });
        return post.toJSON();
    }

    async getPostById(postId) {
        const post = await this.Post.findByPk(postId);
        return post ? post.toJSON() : null;
    }

    async updateLikes(postId, newLikes) {
        const post = await this.Post.findByPk(postId);
        if (post) {
            post.likes = newLikes;
            await post.save();
            return post.toJSON();
        }
        return null;
    }

    async addComment(postId, comment) {
        const post = await this.Post.findByPk(postId);
        if (post) {
            const comments = post.comments || [];
            comments.push(comment);
            post.comments = comments;
            await post.save();
            return post.toJSON();
        }
        return null;
    }

    async deletePost(postId) {
        const post = await this.Post.findByPk(postId);
        if (post) {
            await post.destroy();
            return post.toJSON();
        }
        return null;
    }

    async pinPost(postId) {
        const post = await this.Post.findByPk(postId);
        if (post) {
            post.pinned = true;
            await post.save();
            return post.toJSON();
        }
        return null;
    }

    async getAllPosts() {
        const posts = await this.Post.findAll();
        return posts.map(post => post.toJSON());
    }
}

const _SQLitePostModel = new SQLitePostModel();
export default _SQLitePostModel;
