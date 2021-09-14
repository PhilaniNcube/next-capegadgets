export const GTMPageView = (url) => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  })
};
