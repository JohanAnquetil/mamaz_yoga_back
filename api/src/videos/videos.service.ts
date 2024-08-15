import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

@Injectable()
export class VideosService {

  private readonly videosPath = path.resolve(__dirname, '..', '..', 'videos');

 async getVideoDuration(videoPath: string): Promise<number> {
    try {
      const info = await ffprobe(videoPath, { path: ffprobeStatic.path });
      const duration = parseFloat(info.streams[0]?.duration ?? '0');
      return duration;
    } catch (error) {
      console.error('Error retrieving video duration:', error);
      return 0;
    }
  }

  async getVideosInCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ videos: Array<{ name: string, category: string, formattedDuration: string }>, total: number }> {
    const categoryPath = path.join(this.videosPath, category);
    try {
      const files = fs.readdirSync(categoryPath)
        .filter(file => this.isVideoFile(file));
      
      const total = files.length; // Nombre total de vidéos dans la catégorie
      const startIndex = (page - 1) * limit; // Détermine l'index de début en fonction de la page et de la limite
      const paginatedFiles = files.slice(startIndex, startIndex + limit); // Sélectionne les fichiers pour la page actuelle
  
      const videoPromises = paginatedFiles.map(async (file) => {
        const videoPath = path.join(categoryPath, file);
        const durationInSeconds = await this.getVideoDuration(videoPath);
        const formattedDuration = formatDuration(durationInSeconds);
        return { name: file, category, formattedDuration };
      });
  
      const videos = await Promise.all(videoPromises); // Attend que toutes les promesses soient résolues
      return { videos, total }; // Retourne les vidéos paginées et le nombre total
    } catch (error) {
      console.error('Error reading category directory:', error);
      return { videos: [], total: 0 }; // En cas d'erreur, retourne un tableau vide et un total de 0
    }
  }

  getVideosPath(): string {
    return this.videosPath;
  }

  async getCategories(): Promise<Array<{ name: string, videoCount: number }>>  {
    try {
      const directories = fs.readdirSync(this.videosPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(async (dirent) => {
          const videoFiles = await this.getVideosInCategory(dirent.name);
        return { name: dirent.name, videoCount: videoFiles.videos.length }
        });
  
      return Promise.all(directories);
    } catch (error) {
      console.error('Error reading video directory:', error);
      return [];
    }
  }

  async renameCategory(category: string, newName: string): Promise<String> {
    const categoryPath = path.join(this.videosPath, category);
    const newCategoryPath = path.join(this.videosPath, newName);
    if (fs.existsSync(categoryPath)) {
      fs.renameSync(categoryPath, newCategoryPath);
      return `le nom de la vidéo ${category} a été renommé en ${newName}`
    } else {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
  }
    async deleteCategory(category: string): Promise<String> {
        const categoryPath = path.join(this.videosPath, category);
        if (fs.existsSync(categoryPath)) {
          fs.rmdirSync(categoryPath, { recursive: true });
          return `La catégorie ${category} a été effacée`
        } else {
          throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
      }

    // async getVideosInCategory(category: string): Promise<Array<{ name: string, category: string, formattedDuration: any }>> {
    //     const categoryPath = path.join(this.videosPath, category);
    //     try {
    //       const files = fs.readdirSync(categoryPath)
    //         .filter(file => this.isVideoFile(file));
      
    //       const videoPromises = files.map(async (file) => {
    //         const videoPath = path.join(categoryPath, file);
    //         const durationInSeconds = await this.getVideoDuration(videoPath);
    //         const formattedDuration = formatDuration(durationInSeconds);
    //         return { name: file, category, formattedDuration };
    //       });
      
    //       return Promise.all(videoPromises);
    //     } catch (error) {
    //       console.error('Error reading category directory:', error);
    //       return [];
    //     }
    //   }


      
   
    async renameVideo(category: string, video: string, newName: string): Promise<string> {
        const videoPath = path.join(this.videosPath, category, video);
        const fileExtension = path.extname(video);
        const newVideoPath = path.join(this.videosPath, category, `${newName}${fileExtension}`);
      
        if (fs.existsSync(videoPath)) {
          fs.renameSync(videoPath, newVideoPath);
          return `La vidéo '${video}' dans la catégorie '${category}' a été renommée en '${newName}${fileExtension}'`;
        } else {
          throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
        }
      }

      async deleteVideo(category: string, video: string): Promise<String> {
        const videoPath = path.join(this.videosPath, category, video);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
          return `La vidéo ${video} a été effacée`
        } else {
          throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
        }
      }
      
    
      private isVideoFile(file: string): boolean {
        const videoExtensions = ['.mp4', '.mkv', '.avi']; // Ajouter d'autres extensions si nécessaire
        return videoExtensions.includes(path.extname(file).toLowerCase());
      }

        async downloadVideo(category: string, video: string, res: Response): Promise<void> {
    const videoPath = path.join(this.videosPath, category, video);
    
    if (fs.existsSync(videoPath)) {
      res.download(videoPath, video, (err) => {
        if (err) {
          throw new HttpException('Error downloading the video', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });
    } else {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }
  }

  async searchVideos(query: string): Promise<Array<{ category: string, name: string }>> {
    const categories = fs.readdirSync(this.videosPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  
    // Déclaration de `results` avec un type explicite
    let results: Array<{ category: string, name: string }> = [];
  
    for (const category of categories) {
      const categoryPath = path.join(this.videosPath, category);
      const files = fs.readdirSync(categoryPath)
        .filter(file => this.isVideoFile(file) && file.toLowerCase().includes(query.toLowerCase()));
  
      results = results.concat(files.map(file => ({ category, name: file })));
    }
  
    return results;
  }
  

}