import { Injectable } from "@nestjs/common";

@Injectable()
export class ExtractIllustrationImage {
  extractFirstImageUrl(elementorData: any) {
    if (typeof elementorData === "string") {
      elementorData = JSON.parse(elementorData);
    }
    for (const item of elementorData) {
      if (
        item.elType === "widget" &&
        item.widgetType === "image" &&
        item.settings &&
        item.settings.image &&
        item.settings.image.url
      ) {
        return item.settings.image.url;
      }

      if (item.elements) {
        const imageUrl: any = this.extractFirstImageUrl(item.elements);
        if (imageUrl) {
          return imageUrl;
        }
      }
    }
    return null;
  }
}
