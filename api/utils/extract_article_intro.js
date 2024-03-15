module.exports = function extractAllContent(elementorData) {
    const contentArray = [];
    for (const section of elementorData) {
        for (const column of section.elements) {
            for (const widget of column.elements) {
                if (widget.elType === 'widget') {
                    if (widget.widgetType === 'heading') {
                        contentArray.push({ type: 'titre', style: widget.settings.header_size, contenu: widget.settings.title });
                    }
                    // Paragraphes
                    else if (widget.widgetType === 'text-editor') {
                        contentArray.push({ type: 'paragraphe', style: widget.settings.background_color, contenu: widget.settings.editor });
                    }
                    // Vidéos
                    else if (widget.widgetType === 'video') {
                        let videoContent = "URL de la vidéo non disponible";
                        if (widget.settings.youtube_url) {
                            videoContent = widget.settings.youtube_url;
                        } else if (widget.settings.vimeo_url) {
                            videoContent = widget.settings.vimeo_url;
                        } else if (widget.settings.dailymotion_url) {
                            videoContent = widget.settings.dailymotion_url;
                        }
                        contentArray.push({ type: 'video', contenu: videoContent });
                    }
                    // Images
                    else if (widget.widgetType === 'image') {
                        const imageContent = widget.settings.image.url || "URL de l'image non disponible";
                        contentArray.push({ type: 'image', contenu: imageContent });
                    }
                }
            }
        }
    }
    return contentArray;
}