import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  // async getCategoryDetails(id: number) {

  //   console.log({id});
  //   try {
  //     const categoryVideoDetails = await this.categoryRepository
  //     .createQueryBuilder("category")
  //     .leftJoinAndSelect("category.videoDescriptions", "videoDescription")
  //     .where("category.id = :id", { id: id })
  //     //.select(["videoDescription.id"])
  //     .getOne();

  //     console.log({categoryVideoDetails})

  //     return categoryVideoDetails
  //   } catch (error) {
  //     return error
  //   }
  // }

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

  async getCategoryDetails(id: number) {
    try {
      const categoryVideoDetails = await this.categoryRepository
        .createQueryBuilder("category")
        .leftJoinAndSelect("category.videoDescriptions", "videoDescription")
        .where("category.id = :id", { id })
        .getOne();
  
      if (!categoryVideoDetails) {
        throw new Error(`Category with id ${id} not found`);
      }
  
      // Remplacer path et thumbnail par les getters dans videoDescriptions
      const transformedVideoDescriptions = categoryVideoDetails.videoDescriptions.map(
        (video) => ({
          id: video.id,
          name: video.name,
          categoryId: categoryVideoDetails.id,
          categoryName: categoryVideoDetails.category,
          isFreeVideo: video.isFreeVideo,
          lenght: video.lenght,
          date: video.date,
          path: video.fullVideoPath,
          thumbnail: video.thumbnail,
        })
      );
  
      return {
        id: categoryVideoDetails.id,
        category: categoryVideoDetails.category,
        videoDescriptions: transformedVideoDescriptions,
      };
    } catch (error) {
      throw error;
    }
  }
  

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

  async getVideosDetails(id: number) {
    try {
      const videoDetails = await this.videoDescriptionRepository
        .createQueryBuilder('videoDescription')
        .where('videoDescription.id = :id', { id })
        .select([
          "videoDescription.id",
          "videoDescription.category",
          "videoDescription.name",
          "videoDescription.isFreeVideo",
          "videoDescription.date",
          "videoDescription.lenght",
          "videoDescription.path",
          "videoDescription.thumbnail",
        ])
        .getOne();
  
      if (videoDetails) {
        return {
          id: videoDetails.id,
          name: videoDetails.name,
          isFreeVideo: videoDetails.isFreeVideo,
          date: videoDetails.date,
          lenght: videoDetails.lenght,
          thumbnail: videoDetails.thumbnail,
          path: videoDetails.path,
          category: videoDetails.category,
        };
      } else {
        throw new Error('Video not found');
      }
    } catch (error) {
      throw error;
    }
  }
  
  //
  // async getVideosDetails(id: number) {
  //   try {
  //     const videoDetails = await this.videoDescriptionRepository
  //     .createQueryBuilder("videoDescription")
  //     .where("videoDescription.id = :id", { id: id })
  //     .getOne();

  //     // return `/usr/src/app/videos/${videoPath}`

  //     return videoDetails
  //   } catch (error) {
  //     return error
  //   }
  // }
  // async getVideosDetails(id: number) {
  //   try {
  //     const videoDetails = await this.videoDescriptionRepository
  //       .createQueryBuilder('videoDescription')
  //       .where('videoDescription.id = :id', { id })
  //       .select([
  //         "videoDescription.id",
  //         "videoDescription.name",
  //         "videoDescription.isFreeVideo",
  //         "videoDescription.date",
  //         "videoDescription.lenght"
  //       ])
  //       .getOne();
  
  //     if (videoDetails) {
  //       return {
  //         ...videoDetails,
  //         thumbnailPath: videoDetails.fullThumbnailPath,
  //         videoPath: videoDetails.fullVideoPath,
  //       };
  //     } else {
  //       throw new Error('Video not found');
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}