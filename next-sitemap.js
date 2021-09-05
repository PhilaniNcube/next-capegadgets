const siteUrl = 'https://capegadgets.co.za';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', disallow: ['/admin', '/orders', '/order-history'] },
      { userAgent: '*', allow: '/' },
    ],
  },
  exclude: ['/admin', '/orders', '/order-history'],
};
