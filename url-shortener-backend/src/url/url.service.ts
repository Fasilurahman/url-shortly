import { Injectable,NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from './url.schema';
import { CreateUrlDto } from './dto/create-url.dto';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    private configService: ConfigService,
  ) {}

  async createShortUrl(dto: CreateUrlDto, userId: string): Promise<any> {
    const shortCode = nanoid(7);

    const protocol = dto.originalUrl.match(/^(https?):\/\//)?.[1] ?? 'http';
    const shortDomain =
      this.configService.get<string>('SHORT_URL_DOMAIN') || 'sho.rt';

    const shortUrl = `${protocol}://${shortDomain}/url/${shortCode}`;

    const url = new this.urlModel({
      originalUrl: dto.originalUrl,
      shortCode,
      userId,
    });

    await url.save();

    return {
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl,
      createdAt: url.createdAt,
      clicks: 0,
    };
  }

  async deleteUrl(id: string, userId: string): Promise<{ message: string }> {
  const result = await this.urlModel.deleteOne({ _id: id, userId });

  if (result.deletedCount === 0) {
    throw new NotFoundException('URL not found or not authorized');
  }

  return { message: 'URL deleted successfully' };
  }

  async getUserUrls(userId: string): Promise<Url[]> {
    const protocol = 'https';
    const shortDomain =
      this.configService.get<string>('SHORT_URL_DOMAIN') || 'sho.rt';

    const urls = await this.urlModel.find({ userId }).lean();

    return urls.map((url) => ({
      ...url,
      shortUrl: `${protocol}://${shortDomain}/url/${url.shortCode}`,
    }));
  }

  async findByShortCode(code: string): Promise<Url | null> {
    return this.urlModel.findOne({ shortCode: code }).exec();
  }
}
