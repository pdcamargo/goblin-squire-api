import { Request, Response } from 'express';
import { IDndService } from './types';

export class DndController {
  constructor(public service: IDndService) {}

  async getDatabase(_: Request, res: Response) {
    const database = this.service.getDatabase();

    return res.send(database);
  }
}
