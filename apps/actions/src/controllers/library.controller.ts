import { Controller } from '@nestjs/common';
import { LibraryService } from '../services/library.service';

@Controller()
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}
}
