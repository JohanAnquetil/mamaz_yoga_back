import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { Repository } from 'typeorm';
import { PostNews } from '../entities/post-news.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePostDto } from "../dto/create-post.dto";

describe("PostsModule (e2e)", () => {
  // Declare variables for the application instance and the repository
  let app: INestApplication;
  let postRepository: Repository<PostNews>;

  // Before all tests, initialize the NestJS application and get the PostNews repository
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import the main app module
    }).compile();
    

    app = moduleFixture.createNestApplication(); // Create the app instance
    await app.init(); // Initialize the app

    // Get the repository token for PostNews entity
    postRepository = moduleFixture.get<Repository<PostNews>>(getRepositoryToken(PostNews));
  }, 10000); // Increase timeout to handle potentially slow setup

  // Test case for creating a post successfully
  it("/posts (POST) - success", async () => {
    // Create a DTO with the necessary fields
    const createPostDto: CreatePostDto = {
      id: 1,
      postAuthor: 1,
      postDate: new Date(),
      postDateGmt: new Date(),
      postTitle: "Test Post",
      postStatus: "published",
      commentStatus: "open",
      pingStatus: "open",
      postModifiedGmt: new Date(),
      postParent: 0,
      menuOrder: 0,
      postType: "post",
      commentCount: 0,
      postContent: "Test content",
      postExcerpt: "Test excerpt",
      postPassword: "", // Added for validation
      postName: "test-post", // Added for validation
      postModified: new Date(),
      postContentFiltered: '',
      guid: "test-guid", // Added for validation
      postMimeType: "", // Added for validation
      toPing: "", // Ensure this is a string
      pinged: "", // Ensure this is a string
    };

    // Send a POST request to create a post
    const response = await request(app.getHttpServer())
      .post("/posts")
      .send(createPostDto);

    // Verify that the response status is 201 (Created)
    expect(response.status).toBe(201);

    // Fetch the created post from the database
    const post = await postRepository.findOne({ where: { id: createPostDto.id } });
    console.log('Post from DB:', post); // Log the post to verify

    // Ensure the post was created and has the correct title
    expect(post).toBeDefined();
    expect(post?.postTitle).toBe(createPostDto.postTitle);
  });

  // Test case for retrieving a single post by ID
  it("/posts/:id (GET) - should return a single post by ID", async () => {
    // Create and save a post
    const createPostDto: CreatePostDto = {
      id: 1,
      postAuthor: 1,
      postDate: new Date(),
      postDateGmt: new Date(),
      postTitle: "Test Post",
      postStatus: "published",
      commentStatus: "open",
      pingStatus: "open",
      postModifiedGmt: new Date(),
      postParent: 0,
      menuOrder: 0,
      postType: "post",
      commentCount: 0,
      postContent: "Test content",
      postExcerpt: "Test excerpt",
      postPassword: "", // Added for validation
      postName: "test-post", // Added for validation
      postModified: new Date(),
      postContentFiltered: '',
      guid: "test-guid", // Added for validation
      postMimeType: "", // Added for validation
      toPing: "", // Ensure this is a string
      pinged: "", // Ensure this is a string
    };

    await postRepository.save(createPostDto); // Save the post to the database

    // Send a GET request to fetch the post by ID
    const response = await request(app.getHttpServer())
      .get(`/posts/${createPostDto.id}`)
      .expect(200);

    console.log('Response Body Get by Id:', response.body); // Log the response body

    // Verify the post title matches the created post
    const { body } = response;
    expect(body.data.title).toBe(createPostDto.postTitle);
  });

  // Test case for updating a post
  it("/posts/:id (PATCH) - should update a post", async () => {
    // Create and save a post
    const createPostDto: CreatePostDto = {
      id: 1,
      postAuthor: 1,
      postDate: new Date(),
      postDateGmt: new Date(),
      postTitle: "Test Post",
      postStatus: "published",
      commentStatus: "open",
      pingStatus: "open",
      postModifiedGmt: new Date(),
      postParent: 0,
      menuOrder: 0,
      postType: "post",
      commentCount: 0,
      postContent: "Test content",
      postExcerpt: "Test excerpt",
      toPing: "",
      pinged: "",
      postModified: new Date(),
      postContentFiltered: '',
    };

    await postRepository.save(createPostDto); // Save the post to the database

    // DTO for updating the post
    const updatePostDto = {
      postTitle: "Updated Post Title",
      postContent: "Updated content",
    };

    // Send a PATCH request to update the post
    await request(app.getHttpServer())
      .patch(`/posts/${createPostDto.id}`)
      .send(updatePostDto)
      .expect(200);

    // Fetch the updated post from the database
    const updatedPost = await postRepository.findOne({ where: { id: createPostDto.id } });
    // Verify that the post title and content were updated
    expect(updatedPost?.postTitle).toBe(updatePostDto.postTitle);
    expect(updatedPost?.postContent).toBe(updatePostDto.postContent);
  });

  // Test case for deleting a post
  it("/posts/:id (DELETE) - should delete a post", async () => {
    // Create and save a post
    const createPostDto: CreatePostDto = {
      id: 1,
      postAuthor: 1,
      postDate: new Date(),
      postDateGmt: new Date(),
      postTitle: "Test Post",
      postStatus: "published",
      commentStatus: "open",
      pingStatus: "open",
      postModifiedGmt: new Date(),
      postParent: 0,
      menuOrder: 0,
      postType: "post",
      commentCount: 0,
      postContent: "Test content",
      postExcerpt: "Test excerpt",
      toPing: "",
      pinged: "",
      postModified: new Date(),
      postContentFiltered: '',
    };

    await postRepository.save(createPostDto); // Save the post to the database

    // Send a DELETE request to remove the post
    await request(app.getHttpServer())
      .delete(`/posts/${createPostDto.id}`)
      .expect(200);

    // Ensure the post is no longer in the database
    const post = await postRepository.findOne({ where: { id: createPostDto.id } });
    expect(post).toBeNull();
  });

  // After all tests, close the application
  afterAll(async () => {
    await app.close();
  });
});
