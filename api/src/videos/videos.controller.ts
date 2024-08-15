import { Controller, Get, Param, Res, HttpException, HttpStatus, Delete, Put, Body, Query, UseGuards } from '@nestjs/common';
import { VideosService } from './videos.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guards';

@Controller('videos')
@UseGuards(JwtAuthGuard)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('categories')
  getCategories() {
    return this.videosService.getCategories();
  }


// Example of pagination : http://localhost:3000/api/videos/categories/abdominaux?page=1&limit=5
@Get('categories/:category')
async getVideosInCategory(
  @Param('category') category: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10
) {
  return this.videosService.getVideosInCategory(category, page, limit);
}

  @Delete('categories/:category')
  async deleteCategory(@Param('category') category: string) {
    return this.videosService.deleteCategory(category);
  }

  @Put('categories/:category')
  async renameCategory(@Param('category') category: string, @Body('newName') newName: string) {
    return this.videosService.renameCategory(category, newName);
  }

  @Get('categories/:category/:video')
  streamVideo(@Param('category') category: string, @Param('video') video: string, @Res() res: Response) {
    const videoPath = path.join(this.videosService.getVideosPath(), category, video);
    if (!fs.existsSync(videoPath)) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const range = res.req.headers.range;

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

  @Put('categories/:category/:video')
  async renameVideo(
    @Param('category') category: string,
    @Param('video') video: string,
    @Body('newName') newName: string
  ) {
    return this.videosService.renameVideo(category, video, newName);
  }

  @Delete('categories/:category/:video')
  async deleteVideo(@Param('category') category: string, @Param('video') video: string) {
    return this.videosService.deleteVideo(category, video);
  }

  @Get('download/:category/:video')
  downloadVideo(
    @Param('category') category: string,
    @Param('video') video: string,
    @Res() res: Response
  ) {
    return this.videosService.downloadVideo(category, video, res);
  }

// Example of search request: /videos/search?query=abdos
  @Get('search')
async search(@Query('query') query: string) {
  if (!query) {
    throw new HttpException('Query parameter is required', HttpStatus.BAD_REQUEST);
  }
  return this.videosService.searchVideos(query);
}
}
