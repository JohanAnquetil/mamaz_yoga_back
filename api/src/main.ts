import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config({path:"./.env"});
  console.log('NestJS app is starting...');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  // console.log('DB Host:', process.env.DB_HOST);
  // console.log('DB Port:', process.env.DB_PORT);
  // console.log('DB Username:', process.env.DB_USERNAME);
  // console.log('DB Name:', process.env.DB_NAME);
  // console.log('Running in environment:', process.env.NODE_ENV);
  await app.listen(3000);
}
bootstrap();
