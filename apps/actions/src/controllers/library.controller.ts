import { Controller } from '@nestjs/common';
import { LibraryService } from '../services/library.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACTIONS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import {
  CreateLibraryChildDto,
  CreateLibraryDto,
  ListLibraryChildDto,
  ListLibraryDto,
  UpdateLibraryDto,
} from '@libs/common/dtos/library.dto';
import { LibraryChildService } from '../services/library-child.service';
import { AuthType } from '@libs/common/interfaces/common.interface';

@Controller()
export class LibraryController {
  constructor(
    private readonly libraryService: LibraryService,
    private readonly libraryChildService: LibraryChildService,
  ) {}

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.LIBRARY.CREATE_LIBRARY)
  async create(@Payload() payload: CreateLibraryDto) {
    return this.libraryService.createLibrary(payload);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.LIBRARY.LIST_LIBRARY_BY_USER)
  async listLib(@Payload() query: ListLibraryDto) {
    return this.libraryService.listLib(query);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.LIBRARY.UPDATE_LIBRARY)
  async updateLib(@Payload() payload: UpdateLibraryDto) {
    return this.libraryService.updateLibrary(payload);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.LIBRARY.DELETE_LIB)
  async delete(@Payload('id') id: number, @Payload('user') user: AuthType) {
    return this.libraryService.deleteLibrary(id, user);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.LIBRARY.LIST_LIBRARY_CHILD_BY_USER)
  async listCLib(@Payload() query: ListLibraryChildDto) {
    return this.libraryChildService.listLibraryChild(query);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.LIBRARY.ADD_LIBRARY)
  async addC(@Payload() payload: CreateLibraryChildDto) {
    return this.libraryChildService.createLibraryChild(payload);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.LIBRARY.DELETE_C_LIB)
  async deleteCLib(@Payload('id') id: number, @Payload('user') user: AuthType) {
    return this.libraryChildService.deleteLibraryChild(id, user);
  }
}
