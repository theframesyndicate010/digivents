const testimonialService = require('../services/testimonialService');
const { successResponse } = require('../utils/apiResponse');

exports.getTestimonials = async (req, res, next) => {
    try {
        const testimonials = await testimonialService.fetchAllTestimonials();
        return successResponse(res, 'Testimonials retrieved successfully', testimonials);
    } catch (error) {
        console.error('[GET TESTIMONIALS ERROR]', error);
        next(error);
    }
};

// Admin listing includes inactive rows so they can be re-enabled
exports.getTestimonialsAdmin = async (req, res, next) => {
    try {
        const testimonials = await testimonialService.fetchAllTestimonialsAdmin();
        return successResponse(res, 'Testimonials retrieved successfully', testimonials);
    } catch (error) {
        console.error('[GET TESTIMONIALS ADMIN ERROR]', error);
        next(error);
    }
};

exports.getTestimonialById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const testimonial = await testimonialService.getTestimonialById(id);
        return successResponse(res, 'Testimonial retrieved successfully', testimonial);
    } catch (error) {
        console.error(`[GET TESTIMONIAL ${req.params.id} ERROR]`, error);
        next(error);
    }
};

exports.createTestimonial = async (req, res, next) => {
    try {
        const newTestimonial = await testimonialService.createTestimonial(req.body);
        return successResponse(res, 'Testimonial added successfully', newTestimonial, 201);
    } catch (error) {
        console.error('[CREATE TESTIMONIAL ERROR]', error);
        next(error);
    }
};

exports.updateTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await testimonialService.updateTestimonial(id, req.body);
        return successResponse(res, 'Testimonial updated successfully', updated);
    } catch (error) {
        console.error(`[UPDATE TESTIMONIAL ${req.params.id} ERROR]`, error);
        next(error);
    }
};

exports.deleteTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;
        await testimonialService.deleteTestimonial(id);
        return successResponse(res, 'Testimonial deleted successfully');
    } catch (error) {
        console.error(`[DELETE TESTIMONIAL ${req.params.id} ERROR]`, error);
        next(error);
    }
};