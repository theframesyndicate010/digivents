module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  proxy: {
    enabled: true,
    // Trust Railway's proxy headers
    trust: ['127.0.0.1', 'loopback', 'linklocal', 'uniquelocal', '::1', '::ffff:127.0.0.1'],
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  url: env('PUBLIC_URL'),
});
