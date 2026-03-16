module.exports = ({ env }) => ({
  upload:{
    config:{
      provider: "strapi-provider-upload-supabase",
      providerOptions: {
        supabaseUrl: env("SUPABASE_API_URL") || env("SUPABASE_URL"),
        apikey: env("SUPABASE_API_KEY") || env("SUPABASE_ANON_KEY"),
        bucket: env("SUPABASE_BUCKET"),
        directory : env("SUPABASE_DIRECTORY", "uploads"),
        option:{}
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
    },
  },
},
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