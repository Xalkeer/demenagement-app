import { Request, Response } from 'express';
import * as listsService from '../services/lists.service';

export const getAllLists = async (req: Request, res: Response) => {
  try {
    const lists = await listsService.getAllLists();
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lists' });
  }
};

export const createList = async (req: Request, res: Response) => {
  try {
    const list = await listsService.createList(req.body);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create list' });
  }
};

export const deleteList = async (req: Request, res: Response) => {
  try {
    await listsService.deleteList(Number(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete list' });
  }
};
