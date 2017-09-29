module.exports = {
  siteMetadata: {
    title: `modern-chart`,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-glamor',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-105846113-1',
      },
    }
  ],
  pathPrefix: '/modern-chart'
}
