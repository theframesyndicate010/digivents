module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/upload',
      handler: 'upload.upload',
      config: {
        policies: ['api::upload.is-authenticated'],
        middlewares: [],
      },
    },
  ],
};