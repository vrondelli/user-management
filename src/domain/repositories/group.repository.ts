import { Injectable } from '@nestjs/common';
import { Group } from '../entities/group/group.entity';

@Injectable()
export abstract class GroupRepository {
  abstract getByName(name: string): Promise<Group | null>;
  abstract getById(id: string): Promise<Group | null>;
}
