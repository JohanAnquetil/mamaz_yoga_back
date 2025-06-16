import { Controller, Get, Param, Res, HttpException, HttpStatus, Delete, Put, Body, Query, UseGuards, Post, ParseIntPipe, NotFoundException, SetMetadata } from '@nestjs/common';
import { VideosService } from './videos.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}
  
    @Get()
    async findAll() {
      return this.videosService.findAll();
    }
  
  @Get('categories')
  getCategories() {
    return this.videosService.getCategories();
  }

  @Get('categories/:id')
  async fetchCategoryVideosDetails(@Param("id", ParseIntPipe) id: number) {
    try {
      console.log("enterded in category/:id", id)
      const categoryVideoDetails = await this.videosService.getCategoryDetails(id)
      if(!categoryVideoDetails) {
        throw new NotFoundException(`La catégorie avec l'id : ${id} n'existe pas`);
      }
      return categoryVideoDetails;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
    }
  }
  }

  @Get('get-tags')
  async getTags() {
    return this.videosService.getTags();
  }

  @Get('watch-video/:video')
  async streamVideo(@Param('video', ParseIntPipe) videoId: number, @Res() res: Response) {
    // const videoPath: any = await this.videosService.getVideosPath(category, video);
    const videoPath: any = await this.videosService.getVideo(videoId)
    if (!fs.existsSync(videoPath)) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    console.log({videoPath})

    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const range = res.req.headers.range;

    console.log({fileSize})

    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    // res.setHeader('Accept-Ranges', 'bytes');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  }

@Post('record-video')
async recordVideoWatchedByUser(
  @Body() data: { userId: number; videoId: number; date: string, viewingTime: number },
) {
  // Vérifie la présence des données nécessaires
  if (!data.userId || !data.videoId || !data.date) {
    throw new HttpException(
      'Missing required fields (userId, videoId, date)',
      HttpStatus.BAD_REQUEST,
    );
  }

  // Appelle le service pour enregistrer le visionnage
  const record = await this.videosService.recordVideoWatched(data);

  console.log(record)

  return {
    message: 'Video watch recorded successfully',
    data: record,
  };
}

@Post('record-favorite')
async recordVideoFavorites(
  @Body() data: { userId: number; videoId: number; date: string, viewingTime: number },
) {
  // Vérifie la présence des données nécessaires
  if (!data.userId || !data.videoId || !data.date) {
    throw new HttpException(
      'Missing required fields (userId, videoId, date)',
      HttpStatus.BAD_REQUEST,
    );
  }

  // Appelle le service pour enregistrer le visionnage
  const record = await this.videosService.recordFavorite(data);

  console.log(record)

  return {
    message: 'Favorite recorded successfully',
    data: record,
  };
}

@Delete("delete-favori")
async delete(
  @Body() data: { videoId: number, userId: number }, 
) : Promise<string> {
  console.log("data", data);
  await this.videosService.delete(data);
  return "Favori effacé !";
}

@Get('fetch-favorites')
async fetchFavorites() {
  return await this.videosService.fetchFavorites();
}

@Get('fetch-favorite/:id')
async findOneFavorite(@Param("id", ParseIntPipe) id: number,){
  try {
    const favorite = await this.videosService.findOneFavorite(id);
    if(!favorite) {
      throw new NotFoundException(`L'historique de la vidéo avec l'id : ${id} n'existe pas`);
    }
    return favorite
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
  }
}


@Get('fetch-historic')
async fetchHistoric() {
  return await this.videosService.fetchHistoric();
}

@Get('fetch-historic/:id')
async findOneHistoric(@Param("id", ParseIntPipe) id: number,){
  try {
    const historic = await this.videosService.findOneHistoric(id);
    if(!historic) {
      throw new NotFoundException(`L'historique de la vidéo avec l'id : ${id} n'existe pas`);
    }
    return historic
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
  }
}

@Get('get-videos-details/:id')
async getVideosDetails(@Param("id", ParseIntPipe) id: number,){
  try {
    const videoDetails = await this.videosService.getVideosDetails(id);
    if(!videoDetails) {
      throw new NotFoundException(`La video avec l'id: ${id} n'existe pas`);
    }
    return videoDetails
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
  }
}

@Get('thumbnails/:category/:filename')
serveThumbnail(
  @Param('category') category: string,
  @Param('filename') filename: string,
  @Res() res: Response,
) {
  // Chemin complet vers le dossier des thumbnails
  const thumbnailPath = path.join(
    '/usr/src/app/videos',
    category,
    filename,
  );

  console.log('Serving thumbnail:', thumbnailPath);

  // Vérifie si le fichier existe
  if (!fs.existsSync(thumbnailPath)) {
    throw new HttpException('Thumbnail non trouvé', HttpStatus.NOT_FOUND);
  }

  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Retourne l'image si elle existe
  return res.sendFile(thumbnailPath);
}

}
