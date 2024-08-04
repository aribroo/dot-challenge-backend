import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';
import { IPost } from '../common/interface/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: number, createPostDto: CreatePostDto): Promise<IPost> {
    return this.databaseService.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        user_id: userId,
      },
    });
  }

  async findAll(): Promise<IPost[]> {
    return this.databaseService.post.findMany();
  }

  async findOne(id: number): Promise<IPost | undefined> {
    const post = await this.databaseService.post.findUnique({
      where: { id },
    });

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(userId: number, postId: number, updatePostDto: UpdatePostDto): Promise<IPost> {
    const existingPost = await this.findOne(postId);

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    if (existingPost.user_id !== userId) {
      throw new ForbiddenException('You are not allowed to update this post');
    }

    return this.databaseService.post.update({
      data: updatePostDto,
      where: { id: postId },
    });
  }

  async remove(userId: number, postId: number): Promise<string> {
    const post = await this.findOne(postId);

    if (post.user_id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    await this.databaseService.post.delete({
      where: { id: postId },
    });

    return 'Post deleted successfully';
  }
}
