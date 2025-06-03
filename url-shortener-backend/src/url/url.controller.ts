import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(JwtAuthGuard)
  @Post('shorten')
  shortenUrl(@Body() dto: CreateUrlDto, @Request() req) {
    console.log('DTO received:', dto);
    console.log('touching in shorten controller');
    return this.urlService.createShortUrl(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUrl(@Param('id') id: string, @Request() req) {
    console.log('touching in delete controller and id is', id);
    return this.urlService.deleteUrl(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyUrls(@Request() req) {
    return this.urlService.getUserUrls(req.user.userId);
  }

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const url = await this.urlService.findByShortCode(code);
    if (!url) throw new NotFoundException('URL not found');
    return res.redirect(url.originalUrl);
  }
}
