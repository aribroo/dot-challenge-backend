import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../common/decorator/get-user.decorator';
import { IJwtPayload } from '../common/interface/user.interface';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('Post API')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new post' })
  @Post()
  async createPost(@GetUser() user: IJwtPayload, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(user.sub, createPostDto);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @Get()
  async getAllPosts() {
    return this.postService.findAll();
  }

  @ApiOperation({ summary: 'Get a specific post by ID' })
  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a post by ID' })
  @Patch(':id')
  async update(@GetUser() user: IJwtPayload, @Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(user.sub, id, updatePostDto);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a post by ID' })
  @Delete(':id')
  async remove(@GetUser() user: IJwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(user.sub, id);
  }
}
