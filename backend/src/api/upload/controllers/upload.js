module.exports = {
  async upload(ctx) {
    try {
      const file = ctx.request.files?.file;

      if (!file) {
        return ctx.badRequest('No file provided');
      }

      const validationError = await strapi
        .service('api::upload.upload')
        .validateFile(file);

      if (validationError) {
        return ctx.badRequest(validationError);
      }

      const imageUrl = await strapi
        .service('api::upload.upload')
        .uploadImage(file);

      ctx.set('Content-Type', 'application/json');
      return { url: imageUrl };
    } catch (err) {
      console.error('Upload error:', err);
      ctx.throw(500, `Upload failed: ${err.message}`);
    }
  },
};