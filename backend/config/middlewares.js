module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    "name": "strapi::security",
    "config": {
      "contentSecurityPolicy": {
        "useDefaults": true,
        "directives": {
          "connect-src": ["'self'", "https:"],
          "img-src": [          {
            name: 'strapi::cors',
            config: {
              origin: ['https://digivents.com.np', 'http://localhost:3000'],
              methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
              headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
              keepHeaderOnError: true,
            },
          },
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "ik.imagekit.io", // ImageKit domain for images, add your custom domain if you use one
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "ik.imagekit.io", // ImageKit domain for videos/audio, add your custom domain if you use one
          ],
          "frame-src": [
            "'self'",
            "data:",
            "blob:",
            "eml.imagekit.io", // For ImageKit UI components
          ],
          "upgradeInsecureRequests": null,
        },
      },
    },
  },

  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
