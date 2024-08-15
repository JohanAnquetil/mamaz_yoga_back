import { Injectable } from "@nestjs/common";

@Injectable()
export class ElementorDataService {
  extractAllContent(elementorData: any): any[] {
    const contentArray = [];
    try {
      // Si elementorData est une chaîne de caractères JSON, la convertir en objet
      if (typeof elementorData === "string") {
        elementorData = JSON.parse(elementorData);
      }

      for (const section of elementorData) {
        if (!section.elements) continue;
        for (const column of section.elements) {
          if (!column.elements) continue;
          for (const widget of column.elements) {
            if (widget.elType === "widget") {
              if (widget.widgetType === "heading") {
                contentArray.push({
                  type: "titre",
                  style: widget.settings?.header_size,
                  contenu: widget.settings?.title,
                });
              } else if (widget.widgetType === "text-editor") {
                contentArray.push({
                  type: "paragraphe",
                  style: widget.settings?.background_color,
                  contenu: widget.settings?.editor,
                });
              } else if (widget.widgetType === "video") {
                let videoContent = "URL de la vidéo non disponible";
                if (widget.settings?.youtube_url) {
                  videoContent = widget.settings.youtube_url;
                } else if (widget.settings?.vimeo_url) {
                  videoContent = widget.settings.vimeo_url;
                } else if (widget.settings?.dailymotion_url) {
                  videoContent = widget.settings.dailymotion_url;
                }
                contentArray.push({ type: "video", contenu: videoContent });
              } else if (widget.widgetType === "image") {
                const imageContent =
                  widget.settings?.image?.url ||
                  "URL de l'image non disponible";
                contentArray.push({ type: "image", contenu: imageContent });
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse elementorData", e);
    }
    return contentArray;
  }
}
