const postService = require('../services/postService');
const { successResponse } = require('../utils/apiResponse');

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await postService.fetchAllPosts();
        return successResponse(res, 'Posts retrieved successfully', posts);
    } catch (error) {
        console.error('[GET POSTS ERROR]', error);
        next(error);
    }
};

exports.getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await postService.getPostById(id);
        return successResponse(res, 'Post retrieved successfully', post);
    } catch (error) {
        console.error(`[GET POST ${req.params.id} ERROR]`, error);
        next(error);
    }
};

exports.createPost = async (req, res, next) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }

        const newPost = await postService.createPost(req.body, req.files);
        return successResponse(res, 'Post added successfully', newPost, 201);
    } catch (error) {
        console.error('[CREATE POST ERROR]', error);
        next(error);
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        const updatedPost = await postService.updatePost(req.params.id, req.body, req.files);
        return successResponse(res, 'Post updated successfully', updatedPost);
    } catch (error) {
        console.error(`[UPDATE POST ${req.params.id} ERROR]`, error);
        next(error);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        await postService.deletePost(req.params.id);
        return successResponse(res, 'Post deleted successfully');
    } catch (error) {
        console.error(`[DELETE POST ${req.params.id} ERROR]`, error);
        next(error);
    }
};
