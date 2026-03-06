module.exports = ({ env }) => ({
  imagekit: {
    enabled: true,
    config: {
      // Basic Configuration
      publicKey: env("IMAGEKIT_PUBLIC_KEY"),
      privateKey: env("IMAGEKIT_PRIVATE_KEY"),
      urlEndpoint: env("IMAGEKIT_URL_ENDPOINT"),

      // Delivery Configuration
      enabled: true,
      useTransformUrls: true,
      useSignedUrls: false,
      expiry: 3600, // URL expiry time in seconds when useSignedUrls is true

      // Upload Configuration
      uploadEnabled: true,

      // Upload Options
      uploadOptions: {
        folder: "/strapi-uploads/",
        tags: ["strapi", "media"],
        overwriteTags: false,
        checks: "", // Example: '"file.size" <= "5MB"'
        isPrivateFile: false,
      },
    },
  },
});