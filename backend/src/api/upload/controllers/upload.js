module.exports = {
  async upload(ctx) {
    try {
      const file = ctx.request.files.file;

      const imageUrl = await strapi
        .service('api::upload.upload')
        .uploadImage(file);

      return { url: imageUrl };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};