import { Module } from "@nestjs/common";    // 95% of time `common` is the place to import
import { AppController } from "./app.controller";

@Module({
    controllers: [AppController]    // create AppController handler
})
export class AppModule {}
