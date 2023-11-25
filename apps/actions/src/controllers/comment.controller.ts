import { Controller, Get } from '@nestjs/common';
import { CommentService } from '../services/comment.service';

@Controller()
export class CommentController {
  constructor(private readonly service: CommentService) {}
}
