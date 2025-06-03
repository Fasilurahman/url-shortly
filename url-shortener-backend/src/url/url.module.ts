import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './url.schema';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';


@Module({
    imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
    providers: [UrlService],
    controllers: [UrlController],
})

export class UrlModule {}