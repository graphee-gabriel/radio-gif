const withPlugins = require("next-compose-plugins")
const optimizedImages = require("next-optimized-images")
const withVideos = require("next-videos")

module.exports = withVideos(
  withPlugins(
    [
      [
        optimizedImages,
        {
          handleImages: ['jpeg', 'png', 'svg', 'webp', 'gif'],
          /* config for next-optimized-images */
        },
      ],

      // your other plugins here
    ],
    {
      images: {
        domains: ["storage.googleapis.com"],
      },
      async redirects() {
        return []
      },
      async rewrites() {
        return [
          // Rewrite everything else to use `pages/index`
          {
            source: "/:path*",
            destination: "/",
          },
        ]
      },
    }
  )
)
