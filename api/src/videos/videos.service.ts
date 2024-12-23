import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/users/entities/user.entity';
import { Repository } from 'typeorm';
import { VideoCategory } from './entities/categories.entity';
import { VideoDescription } from './entities/videos_description.entity';
import { VideosHistory } from './entities/historic.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(VideoCategory)
    private readonly categoryRepository: Repository<VideoCategory>,

    @InjectRepository(VideoDescription)
    private readonly videoDescriptionRepository: Repository<VideoDescription>,

    @InjectRepository(VideosHistory)
    private readonly videoHistoryRepository: Repository<VideosHistory>,

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

    // async findAll() {
    //   const allVideos = await this.videoDescriptionRepository.find();
    //   if (allVideos.length > 0) {
    //     return {
    //       message: "Des vidéos ont été trouvées",
    //       data: allVideos,
    //     };
    //   } else {
    //     return "Aucune vidéo trouvée  ";
    //   }
    // }

    async findAll() {
      const allVideos = await this.videoDescriptionRepository
        .createQueryBuilder('video')
        .leftJoinAndSelect('video.category', 'category')
        .getMany();
    
      if (allVideos.length > 0) {
        const videosWithCategory = allVideos.map(video => ({
          ...video,
          categoryId: video.category?.id,
          categoryName: video.category?.category
        }));
    
        return {
          message: "Des vidéos ont été trouvées",
          data: videosWithCategory
        };
      } else {
        return "Aucune vidéo trouvée";
      }
    }

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

  async recordVideoWatched(data: { 
    userId: number; 
    videoId: number; 
    date: string; 
    viewingTime?: number; 
  }): Promise<VideosHistory> {
    try {
      console.log(data);
  
      // Vérifie si une entrée existe déjà
      let record = await this.videoHistoryRepository.findOne({
        where: {
          user: data.userId,
          video: data.videoId,
        },
      });
  
      if (record) {
        // Mise à jour de l'entrée existante
        record.date = new Date(data.date);
        record.viewing_time_in_minutes += data.viewingTime ?? 10;
        console.log('Record updated:', record);
      } else {
        // Création d'une nouvelle entrée
        record = this.videoHistoryRepository.create({
          user: data.userId,
          video: data.videoId,
          date: new Date(data.date),
          viewing_time_in_minutes: data.viewingTime ?? 10,
        });
        console.log('New record created:', record);
      }
  
      return await this.videoHistoryRepository.save(record);
    } catch (error) {
      console.error('Error saving video watch record:', error);
      throw new HttpException(
        'Could not record video watch. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  
  // async recordVideoWatched(data: { 
  //   userId: number; 
  //   videoId: number; 
  //   date: string; 
  //   viewingTime?: number; 
  // }): Promise<VideosHistory> {
  //   try {
  //     console.log(data);
  
  //     const record = this.videoHistoryRepository.create({
  //       user: data.userId,
  //       video: data.videoId,
  //       date: new Date(data.date) ?? Date.now,
  //       viewing_time_in_minutes: data.viewingTime ?? 10,
  //     });
  
  //     console.log('Record to save:', record);
  
  //     // Sauvegarde dans la base de données
  //     return await this.videoHistoryRepository.save(record);
  //   } catch (error) {
  //     console.error('Error saving video watch record:', error);
  //     throw new HttpException(
  //       'Could not record video watch. Please try again.',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
  

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
        .createQueryBuilder("history")
        .leftJoinAndSelect("history.videoEntity", "videoEntity")
        .leftJoinAndSelect("videoEntity.category", "category")
        .where("history.user = :userId", {userId: id})
        .getMany();

      const formattedHistoric = userHistoric.map(history => ({
        // Données historique (niveau racine)
        video: history.video,
        user: history.user,
        date: history.date,
        viewing_time_in_minutes: history.viewing_time_in_minutes,
        
        // Données vidéo (imbriquées)
        video_entity: {
          id: history.videoEntity.id,
          name: history.videoEntity.name,
          path: history.videoEntity.path,
          isFreeVideo: history.videoEntity.isFreeVideo,
          thumbnail: history.videoEntity.thumbnail,
          date: history.videoEntity.date,
          lenght: history.videoEntity.lenght,
          categoryId: history.videoEntity.category?.id,
          category: history.videoEntity.category?.category
        }
      }));

      return {
        message: "Historique trouvé",
        data: formattedHistoric
      };
    }
    catch(error) {
      throw error;
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