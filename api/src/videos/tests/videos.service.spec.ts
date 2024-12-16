// import { Test, TestingModule } from '@nestjs/testing';
// import { VideosService } from '../videos.service';
// import * as fs from 'fs';
// import * as path from 'path';

// jest.mock('fs');

// describe('VideosService', () => {
//   let service: VideosService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [VideosService],
//     }).compile();

//     service = module.get<VideosService>(VideosService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should return video path', () => {
//     const videoPath = service.getVideosPath();
//     expect(videoPath).toEqual(expect.stringContaining('videos'));
//   });

//   it('should rename a video', async () => {
//     jest.spyOn(fs, 'existsSync').mockReturnValue(true);
//     jest.spyOn(fs, 'renameSync').mockImplementation(() => {});

//     const result = await service.renameVideo('category', 'video.mp4', 'newName');
//     expect(result).toBe("La vidéo 'video.mp4' dans la catégorie 'category' a été renommée en 'newName.mp4'");
//   });

//   it('should delete a video', async () => {
//     jest.spyOn(fs, 'existsSync').mockReturnValue(true);
//     jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

//     const result = await service.deleteVideo('category', 'video.mp4');
//     expect(result).toBe('La vidéo video.mp4 a été effacée');
//   });

//   it('should search videos', async () => {
//     // Mocking the directory structure
//     jest.spyOn(fs, 'readdirSync').mockImplementation((dirPath) => {
//       const dirPathString = String(dirPath);  // Convertir dirPath en string
//       if (dirPathString === service.getVideosPath()) {
//         return [
//           { name: 'category', isDirectory: () => true } as unknown as fs.Dirent,
//         ];
//       } else if (dirPathString.includes('category')) {
//         return [
//           { name: 'video1.mp4', isDirectory: () => false } as unknown as fs.Dirent,
//           { name: 'video2.mkv', isDirectory: () => false } as unknown as fs.Dirent,
//         ];
//       }
//       return [];
//     });
  
//     // Mocking isVideoFile to return true for these files
//     jest.spyOn(service as any, 'isVideoFile').mockReturnValue(true);
  
//     // Perform the search
//     const result = await service.searchVideos('video');
  
//     // Ensure the result is as expected
//     expect(result).toEqual([
//       { category: 'category', name: 'video1.mp4' },
//       { category: 'category', name: 'video2.mkv' },
//     ]);
//   });
  
  

//   it('should return categories with video count', async () => {
//     jest.spyOn(fs, 'readdirSync').mockReturnValue([
//       { name: 'category1', isDirectory: () => true } as unknown as fs.Dirent,
//       { name: 'category2', isDirectory: () => true } as unknown as fs.Dirent,
//     ]);

//     jest.spyOn(service, 'getVideosInCategory').mockResolvedValue({
//       videos: [{ name: 'video1.mp4', category: 'category1', formattedDuration: '1:00' }],
//       total: 1,
//     });

//     const result = await service.getCategories();
//     expect(result).toEqual([
//       { name: 'category1', videoCount: 1 },
//       { name: 'category2', videoCount: 1 },
//     ]);
//   });
// });
