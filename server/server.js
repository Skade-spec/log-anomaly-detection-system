import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { db } from './config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { requireRole } from './middlewares/requireRole.js';
import { auth } from './middlewares/auth.js';

dotenv.config({ path: './config/.env' });

const PORT = process.env.PORT || 3213;
const SECRET = process.env.SECRET;

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username и password обязательны' });

  const result = await db.query('SELECT * FROM users WHERE username=$1', [username]);
  const user = result.rows[0];

  console.log('DB result:', result.rows);
  if (!user) return res.status(401).json({ message: 'Неверный username или пароль' });

  console.log('Password from request:', password);
  console.log('Hash from DB:', user.password_hash);

  const match = await bcrypt.compare(password, user.password_hash);
  console.log('Password match:', match);

  if (!match) return res.status(401).json({ message: 'Неверный username или пароль' });

  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      role: user.role 
    },
    SECRET,
    { expiresIn: '1h' }
  );
  res.json({
    token,
    username: user.username,
    role: user.role
  });
});

app.get('/logs/anomalies', requireRole('security'), async (req, res) => {
    try {
        const pattern = req.query.pattern || '^[a-zA-Z0-9 _:\\-]+$'; 

        const spikes = await db.query(`
            WITH baseline AS (
                SELECT 
                    DATE_TRUNC('minute', timestamp) AS minute,
                    COUNT(*) AS count
                FROM logs
                WHERE severity = 'error'
                GROUP BY minute
            ),
            stats AS (
                SELECT 
                    AVG(count) AS avg_count,
                    STDDEV(count) AS std_count
                FROM baseline
            )
            SELECT minute, count
            FROM baseline, stats
            WHERE baseline.count > stats.avg_count + stats.std_count * 3
            ORDER BY count DESC
        `);

        const weirdMessages = await db.query(`
            SELECT *
            FROM logs
            WHERE message !~ $1
            ORDER BY timestamp DESC
            LIMIT 100
        `, [pattern]);

        const sourceSpikes = await db.query(`
            WITH per_source AS (
                SELECT source, COUNT(*) AS c
                FROM logs
                WHERE timestamp >= NOW() - INTERVAL '5 minutes'
                GROUP BY source
            ),
            avg_source AS (
                SELECT source, AVG(count) AS avg_c
                FROM (
                    SELECT 
                        source,
                        DATE_TRUNC('minute', timestamp) AS minute,
                        COUNT(*)
                    FROM logs
                    GROUP BY source, minute
                ) t
                GROUP BY source
            )
            SELECT p.source, p.c AS current_count, a.avg_c AS avg_count
            FROM per_source p
            JOIN avg_source a USING (source)
            WHERE p.c > a.avg_c * 3
            ORDER BY current_count DESC
        `);

        res.json({
            spikes: spikes.rows,
            weird_messages: weirdMessages.rows,
            source_spikes: sourceSpikes.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/logs/dashboard', async (req, res) => {
  try {

    const logs24hRes = await db.query(`
      SELECT COUNT(*) AS count,
             SUM(CASE WHEN timestamp >= NOW() - INTERVAL '48 hours' AND timestamp < NOW() - INTERVAL '24 hours' THEN 1 ELSE 0 END) AS yesterday
      FROM logs
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
    `);

    const logsCount = Number(logs24hRes.rows[0].count);
    const logsYesterday = Number(logs24hRes.rows[0].yesterday);

    const chartRes = await db.query(`
      SELECT DATE_TRUNC('hour', timestamp) AS hour, COUNT(*) AS count
      FROM logs
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
      GROUP BY hour
      ORDER BY hour ASC
    `);

    const logsChart = chartRes.rows.map(r => ({
      time: r.hour.toISOString().substr(11,5),
      count: Number(r.count)
    }));

    const anomaliesRes = await db.query(`
      SELECT severity, COUNT(*) AS count
      FROM logs
      WHERE timestamp >= NOW() - INTERVAL '24 hours' AND severity IN ('WARN','ERROR','CRITICAL')
      GROUP BY severity
    `);

    const anomaliesByType = {};
    let anomaliesTotal = 0;
    anomaliesRes.rows.forEach(r => {
      anomaliesByType[r.severity] = Number(r.count);
      anomaliesTotal += Number(r.count);
    });

    const sourcesRes = await db.query(`
      SELECT source,
             COUNT(*) AS total,
             SUM(CASE WHEN severity='error' THEN 1 ELSE 0 END) AS warning
      FROM logs
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
      GROUP BY source
    `);

    let active = 0, warning = 0;
    sourcesRes.rows.forEach(r => {
      active += 1;
      warning += Number(r.warning);
    });
    const sourcesTotal = sourcesRes.rows.length;
    const offline = 0; 

    const activityRes = await db.query(`
      SELECT DATE_TRUNC('minute', timestamp) AS minute, COUNT(*) AS count
      FROM logs
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
      GROUP BY minute
      ORDER BY minute ASC
    `);
    const activity = activityRes.rows.map(r => ({
      time: r.minute.toISOString().substr(11,5),
      count: Number(r.count)
    }));

    const lastLogsRes = await db.query(`
      SELECT * FROM logs
      ORDER BY timestamp DESC
      LIMIT 5
    `);

    res.json({
      logs_24h: { count: logsCount, yesterday: logsYesterday, chart: logsChart },
      anomalies: { total: anomaliesTotal, byType: anomaliesByType },
      sources: { total: sourcesTotal, active, warning, offline },
      activity,
      last_logs: lastLogsRes.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/logs/filter', async (req, res) => {
  try {
    const { levels, host, source, keywords, from, to } = req.query;
    const conditions = [];
    const params = [];

    if(levels) { 
      conditions.push(`severity = ANY($${params.length+1}::text[])`);
      params.push(levels.split(','));
    }
    if(host) { conditions.push(`host = $${params.length+1}`); params.push(host); }
    if(source) { conditions.push(`source = $${params.length+1}`); params.push(source); }
    if(keywords) { conditions.push(`message ILIKE $${params.length+1}`); params.push(`%${keywords}%`); }
    if(from) { conditions.push(`timestamp >= $${params.length+1}`); params.push(from); }
    if(to) { conditions.push(`timestamp <= $${params.length+1}`); params.push(to); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await db.query(`SELECT * FROM logs ${where} ORDER BY timestamp DESC LIMIT 500`, params);
    res.json(result.rows);

  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/admin/users', auth, requireRole('admin'), async (req, res) => {
  const users = await db.query(
    'SELECT id, username, role, created_at FROM users ORDER BY id'
  );
  res.json(users.rows);
});

app.post('/admin/users', auth, requireRole('admin'), async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO users (username, password_hash, role)
     VALUES ($1, $2, $3)`,
    [username, hash, role]
  );

  res.json({ message: 'User created' });
});

app.patch('/admin/users/:id/role', auth, requireRole('admin'), async (req, res) => {
  const { role } = req.body;

  await db.query(
    'UPDATE users SET role=$1 WHERE id=$2',
    [role, req.params.id]
  );

  res.json({ message: 'Role updated' });
});

app.patch('/admin/users/:id/password', auth, requireRole('admin'), async (req, res) => {
  const { password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await db.query(
    'UPDATE users SET password_hash=$1 WHERE id=$2',
    [hash, req.params.id]
  );

  res.json({ message: 'Password updated' });
});

app.delete('/admin/users/:id', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;

  if (req.user.id === Number(id)) {
    return res.status(400).json({ message: "Нельзя удалить себя" });
  }

  await db.query('DELETE FROM users WHERE id=$1', [id]);

  res.json({ message: 'User deleted' });
});


app.listen(PORT, () => {
    console.log(`Server on port: ${PORT}. http://localhost:${3213}`);
})