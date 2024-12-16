import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/users/entities/user.entity';
import { Repository } from 'typeorm';
import { VideoCategory } from './entities/categories.entity';
import { VideoDescription } from './entities/videos_description.entity';
import { VideoHistory } from './entities/historic.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(VideoCategory)
    private readonly categoryRepository: Repository<VideoCategory>,

    @InjectRepository(VideoDescription)
    private readonly videoDescriptionRepository: Repository<VideoDescription>,

    @InjectRepository(VideoHistory)
    private readonly videoHistoryRepository: Repository<VideoHistory>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCategories() {
    return this.categoryRepository.find();
  }


  //       async downloadVideo(category: string, video: string, res: Response): Promise<void> {
  //   const videoPath = path.join(this.videosPath, category, video);
    
  //   if (fs.existsSync(videoPath)) {
  //     res.download(videoPath, video, (err) => {
  //       if (err) {
  //         throw new HttpException('Error downloading the video', HttpStatus.INTERNAL_SERVER_ERROR);
  //       }
  //     });
  //   } else {
  //     throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
  //   }
  // }
  // async searchVideos(query: string): Promise<Array<{ category: string, name: string }>> {
  //   const categories = fs.readdirSync(this.videosPath, { withFileTypes: true })
  //     .filter(dirent => dirent.isDirectory())
  //     .map(dirent => dirent.name);
  
  //   let results: Array<{ category: string, name: string }> = [];
  
  //   for (const category of categories) {
  //     const categoryPath = path.join(this.videosPath, category);
  //     const files = fs.readdirSync(categoryPath, { withFileTypes: true })
  //       .filter(file => this.isVideoFile(file.name) && file.name.toLowerCase().includes(query.toLowerCase()));
  
  //     results = results.concat(files.map(file => ({ category, name: file.name })));
  //   }
  
  //   return results;
  // }

  async recordVideoWatched(data: { userId: number; videoId: number; date: string, viewingTime?: number }): Promise<VideoHistory> {
    try {
      console.log(data);
      const record = this.videoHistoryRepository.create({
        user: { id: data.userId } as User,
        video: { id: data.videoId } as VideoDescription,
        date: new Date(data.date),
        viewingTime: data.viewingTime ?? 10,
      });

      console.log('Record to save:', record);

      // Sauvegarde dans la base de données
      return await this.videoHistoryRepository.save(record);
    } catch (error) {
      console.error('Error saving video watch record:', error);
      throw new HttpException(
        'Could not record video watch. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchHistoric() {
    const allHistoric = await this.videoHistoryRepository.find()

    if (allHistoric.length > 0) {
      return {
        message: "L'historique a été trouvé",
        data: allHistoric,
      }
    }
    else {
      return "Aucun historique trouvé"
    }
  }

  async findOneHistoric(id: number) {
    try {
      const userHistoric = await this.videoHistoryRepository
      .createQueryBuilder("videoHistoric")
      .leftJoinAndSelect("videoHistoric.video", "video")
      .leftJoinAndSelect("videoHistoric.user", "user")
      .select([
        "videoHistoric.id",
        "videoHistoric.date",
        "videoHistoric.viewingTime",
        "user.id",
        "video.id",
      ])
      .where("videoHistoric.user = :userId", {userId : id})
      .getMany();

      return {
        message: "données reçues", 
        data: userHistoric,
      }
    }
    catch(error) {
      return error
    }
  }

  async getVideo(id: number) {
    try {
      const videoPath = await this.videoDescriptionRepository
      .createQueryBuilder("videoDescription")
      .select("videoDescription.path")
      .where("videoDescription.id = :id", { id: id })
      .getOne();

      console.log("in get video service")
      console.log(`/usr/src/app/videos/${videoPath?.path}`)
      // return `/usr/src/app/videos/${videoPath}`

      return `/usr/src/app/videos/${videoPath?.path}`
    } catch (error) {
      return error
    }
  }

}