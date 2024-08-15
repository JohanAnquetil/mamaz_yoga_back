import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { EntityManager, IsNull, Repository, Not, UpdateResult } from "typeorm";
import { PostNews } from "./entities/post-news.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ElementorDataService } from "./utils/extract_elementor_data";
import { ExtractIllustrationImage } from "./utils/extract_illustration_image";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostNews)
    private postsRepository: Repository<PostNews>,
    private readonly EntityManager: EntityManager,
    private readonly elementorDataService: ElementorDataService,
    private readonly extractIllustrationImage: ExtractIllustrationImage,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<void> {
    const post = new PostNews(createPostDto);
    await this.EntityManager.save(post);
  }

  findAll() {
    return this.postsRepository.find();
  }

  async findPublished(): Promise<{ message: string; posts: any } | undefined> {
    try {
      const posts: any = await this.postsRepository
        .createQueryBuilder("PostNews")
        .leftJoinAndSelect("PostNews.postsMeta", "postsMeta")
        .select([
          "PostNews.id",
          "PostNews.postTitle",
          "PostNews.postDate",
          "PostNews.postModified",
          "postsMeta",
        ])
        .where("PostNews.post_status = :status", { status: "publish" })
        .andWhere("PostNews.post_type = :type", { type: "post" })
        .getMany();
      const postFormated2: any = posts.map((post: any) => {
        const elementorData =
          post.postsMeta.find((meta: any) => meta.metaKey === "_elementor_data")
            ?.metaValue || "indéfini";
        const extractedContent =
          elementorData !== "indéfini"
            ? this.elementorDataService.extractAllContent(elementorData)
            : [];
        const illustrationImage =
          this.extractIllustrationImage.extractFirstImageUrl(elementorData);

        return {
          id: post.id,
          post_title: post.postTitle,
          post_date_creation: post.postDate,
          post_date_modified: post.postModified,
          post_illustration_image: illustrationImage,
          post_detailed: extractedContent,
        };
      });

      return {
        message: "Les posts publiés sont bien reçus",
        posts: postFormated2,
      };
    } catch (e) {
      console.log(e);
    }
  }

  async findOne(
    id: number,
  ): Promise<{ message: string; data: {} } | undefined> {
    try {
      const onePostOnly = await this.postsRepository
        .createQueryBuilder("onePostFound")
        .leftJoinAndSelect("onePostFound.postsMeta", "postsMeta")
        .where("onePostFound.id = :id", { id: id })
        .getOne();
      let postContent = undefined;
      let illustrationImage = undefined;

      if (!onePostOnly) {
        throw new NotFoundException(`Le post avec l'id: ${id} n'existe`);
      }
      onePostOnly.postsMeta.map((postMeta) => {
        if (postMeta.metaKey === "_elementor_data") {
          postContent = this.elementorDataService.extractAllContent(
            postMeta.metaValue,
          );
          illustrationImage =
            this.extractIllustrationImage.extractFirstImageUrl(
              postMeta.metaValue,
            );
        }
      });

      return {
        message: "le post a été trouvé",
        data: {
          id: onePostOnly.id,
          title: onePostOnly.postTitle,
          illustration_image: illustrationImage,
          date_creation: onePostOnly.postDate,
          date_modified: onePostOnly.postModified,
          post_content: postContent,
          post_author: onePostOnly.postAuthor,
          post_status: onePostOnly.postStatus,
          comment_status: onePostOnly.commentStatus,
          post_name: onePostOnly.postName,
          post_type: onePostOnly.postType,
          guid: onePostOnly.guid,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Erreur lors de la récupération du post",
      );
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<number> {
    const update: UpdateResult = await this.postsRepository.update(
      id,
      updatePostDto,
    );
    return update.affected!;
  }

  async remove(id: number): Promise<string> {
    await this.postsRepository.delete(id);
    return "Le post a bien été effacé";
  }
}
