import { Request, Response } from 'express';
import * as battlepassService from '../services/battlepass.service';

export const getActiveBattlePass = async (req: Request, res: Response) => {
  try {
    const battlePass = await battlepassService.getActiveBattlePass();
    res.json(battlePass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch battle pass' });
  }
};

export const createBattlePass = async (req: Request, res: Response) => {
  try {
    const battlePass = await battlepassService.createBattlePass(req.body);
    res.json(battlePass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create battle pass' });
  }
};
