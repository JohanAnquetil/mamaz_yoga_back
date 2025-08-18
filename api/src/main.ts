import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config({path:"./.env"});
  console.log('NestJS app is starting...');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  await app.listen(3000);
}
bootstrap();
