module.exports = {
  siteMetadata: {
    title: `modern-chart`,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-105846113-1',
      },
    }
  ],
  pathPrefix: '/modern-chart'
}
