import { Router, Request, Response } from 'express';
import { getPool } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM patients ORDER BY created_at DESC');
  res.json(rows as RowDataPacket[]);
});

router.get('/:id', async (req: Request, res: Response) => {
  const pool = getPool();
  const id = Number(req.params.id);
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM patients WHERE id = ?', [id]);
  res.json((rows as RowDataPacket[])[0] || null);
});

router.post('/', async (req: Request, res: Response) => {
  const { first_name, middle_name, last_name, date_of_birth, status, address } = req.body;
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO patients (first_name, middle_name, last_name, date_of_birth, status, address) VALUES (?, ?, ?, ?, ?, ?)',
    [first_name, middle_name, last_name, date_of_birth, status, address]
  );
  const insertId = result.insertId;
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM patients WHERE id = ?', [insertId]);
  res.status(201).json((rows as RowDataPacket[])[0]);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { first_name, middle_name, last_name, date_of_birth, status, address } = req.body;
  const pool = getPool();
  const id = Number(req.params.id);
  await pool.query(
    'UPDATE patients SET first_name=?, middle_name=?, last_name=?, date_of_birth=?, status=?, address=? WHERE id=?',
    [first_name, middle_name, last_name, date_of_birth, status, address, id]
  );
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM patients WHERE id = ?', [id]);
  res.json((rows as RowDataPacket[])[0]);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const pool = getPool();
  const id = Number(req.params.id);
  await pool.query('DELETE FROM patients WHERE id = ?', [id]);
  res.status(204).end();
});

export default router;
