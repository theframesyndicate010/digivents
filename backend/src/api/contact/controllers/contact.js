'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact.contact', ({ strapi }) => ({
  async create(ctx) {
    console.log('[Contact Controller] POST /api/contacts');
    console.log('[Contact Controller] Request body:', ctx.request.body);

    // Validate required fields
    const { data } = ctx.request.body;
    const requiredFields = ['firstName', 'lastName', 'email', 'message'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return ctx.badRequest(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return ctx.badRequest('Invalid email format');
    }

    try {
      const response = await super.create(ctx);
      console.log('[Contact Controller] Message created successfully:', response);
      
      // Optional: Send email notification to admin
      try {
        await strapi.plugins['email'].services.email.send({
          to: 'digivents02@gmail.com', // Admin email
          subject: `New Contact Form Submission - ${data.subject || 'No Subject'}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${data.message.replace(/\n/g, '<br>')}</p>
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
      throw error;
    }
  },
}));
