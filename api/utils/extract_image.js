function extractFirstImageUrl(elementorData) {
    for (const item of elementorData) {
      if (item.elType === 'widget' && item.widgetType === 'image' && item.settings && item.settings.image && item.settings.image.url) {
        return item.settings.image.url;
      }
      
      if (item.elements) {
        const imageUrl = extractFirstImageUrl(item.elements);
        if (imageUrl) {
          return imageUrl;
        }
      }
    }
    return null;
  }

  module.exports = extractFirstImageUrl;