'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact.contact', ({ strapi }) => ({
  async create(ctx) {
    console.log('[Contact Controller] POST /api/contacts');
    console.log('[Contact Controller] Request body:', JSON.stringify(ctx.request.body, null, 2));

    // Validate that data object exists
    if (!ctx.request.body || !ctx.request.body.data) {
      console.error('[Contact Controller] Missing data object');
      return ctx.badRequest('Request must include data object');
    }

    const { data } = ctx.request.body;
    
    // Validate required fields
    const errors = [];
    if (!data.firstName || !String(data.firstName).trim()) {
      errors.push('firstName is required and cannot be empty');
    }
    if (!data.lastName || !String(data.lastName).trim()) {
      errors.push('lastName is required and cannot be empty');
    }
    if (!data.email || !String(data.email).trim()) {
      errors.push('email is required and cannot be empty');
    }
    if (!data.message || !String(data.message).trim()) {
      errors.push('message is required and cannot be empty');
    }

    if (errors.length > 0) {
      console.error('[Contact Controller] Validation errors:', errors);
      return ctx.badRequest(errors.join('; '));
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(data.email).trim())) {
      console.error('[Contact Controller] Invalid email format:', data.email);
      return ctx.badRequest('Invalid email format');
    }

    // Validate field lengths
    if (String(data.firstName).length > 100) {
      return ctx.badRequest('firstName must be less than 100 characters');
    }
    if (String(data.lastName).length > 100) {
      return ctx.badRequest('lastName must be less than 100 characters');
    }
    if (data.subject && String(data.subject).length > 200) {
      return ctx.badRequest('subject must be less than 200 characters');
    }

    try {
      console.log('[Contact Controller] Creating contact with data:', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        hasSubject: !!data.subject,
        messageLength: String(data.message).length,
      });

      const response = await super.create(ctx);
      console.log('[Contact Controller] Contact created successfully with ID:', response.data.id);
      
      // Optional: Send email notification to admin
      try {
        await strapi.plugins['email'].services.email.send({
          to: 'digivents02@gmail.com',
          subject: `New Contact Form Submission - ${data.subject || 'No Subject'}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${String(data.message).replace(/\n/g, '<br>')}</p>
          `,
        });
        console.log('[Contact Controller] Admin notification email sent');
      } catch (emailError) {
        console.warn('[Contact Controller] Failed to send admin notification:', emailError.message);
        // Don't fail the request if email notification fails
      }

      return response;
    } catch (error) {
      console.error('[Contact Controller] Error creating contact:', error);
      console.error('[Contact Controller] Error details:', {
        message: error.message,
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },
}));
