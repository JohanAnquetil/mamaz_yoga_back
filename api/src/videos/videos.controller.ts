import { Controller, Get, Param, Res, HttpException, HttpStatus, Delete, Put, Body, Query, UseGuards, Post, ParseIntPipe, NotFoundException, SetMetadata } from '@nestjs/common';
import { VideosService } from './videos.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guards';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('categories')
  @UseGuards(JwtAuthGuard)
  getCategories() {
    return this.videosService.getCategories();
  }

  @Get('categories/:id')
  @UseGuards(JwtAuthGuard)
  async fetchCategoryVideosDetails(@Param("id", ParseIntPipe) id: number) {
    try {
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

//  @Get('watch-video/:video')
//   async streamVideo(@Param('video', ParseIntPipe) videoId: number, @Res() res: Response) {
//     // const videoPath: any = await this.videosService.getVideosPath(category, video);
//     return await this.videosService.getVideo(videoId)
//     }


  @Get('watch-video/:video')
  @UseGuards(JwtAuthGuard)
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

  // @Put('categories/:category/:video')
  // async renameVideo(
  //   @Param('category') category: string,
  //   @Param('video') video: string,
  //   @Body('newName') newName: string
  // ) {
  //   return this.videosService.renameVideo(category, video, newName);
  // }

  // @Delete('categories/:category/:video')
  // async deleteVideo(@Param('category') category: string, @Param('video') video: string) {
  //   return this.videosService.deleteVideo(category, video);
  // }

  // @Get('download/:category/:video')
  // downloadVideo(
  //   @Param('category') category: string,
  //   @Param('video') video: string,
  //   @Res() res: Response
  // ) {
  //   return this.videosService.downloadVideo(category, video, res);
  // }

// Example of search request: /videos/search?query=abdos
//   @Get('search')
// async search(@Query('query') query: string) {
//   if (!query) {
//     throw new HttpException('Query parameter is required', HttpStatus.BAD_REQUEST);
//   }
//   return this.videosService.searchVideos(query);
// }

@Post('record-video')
@UseGuards(JwtAuthGuard)
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

@Get('fetch-historic')
@UseGuards(JwtAuthGuard)
async fetchHistoric() {
  return await this.videosService.fetchHistoric();
}

@Get('fetch-historic/:id')
@UseGuards(JwtAuthGuard)
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
@UseGuards(JwtAuthGuard)
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
