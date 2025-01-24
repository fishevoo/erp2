require('dotenv').config();

const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Konfigurasi koneksi database
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: process.env.DB_INSTANCE || 'SQLEXPRESS',
    requestTimeout: 30000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }
};

// Buat pool koneksi global
let globalPool;

// Fungsi untuk mendapatkan pool koneksi
async function getConnection() {
  if (!globalPool) {
    try {
      globalPool = await sql.connect(config);
      console.log('Pool koneksi database berhasil dibuat');
    } catch (err) {
      console.error('Error membuat pool koneksi:', err);
      throw err;
    }
  }
  return globalPool;
}

// Fungsi untuk test koneksi
async function testConnection() {
  try {
    console.log('Mencoba koneksi ke database...');
    const pool = await getConnection();
    
    const result = await pool.request().query('SELECT @@version as version');
    console.log('Versi SQL Server:', result.recordset[0].version);
    
    console.log('Test koneksi berhasil!');
  } catch (err) {
    console.error('Error koneksi database:', err);
    if (err.code === 'ESOCKET') {
      console.error('Tidak dapat terhubung ke server. Pastikan:');
      console.error('1. SQL Server sedang berjalan');
      console.error('2. Port yang dikonfigurasi terbuka');
      console.error('3. IP/hostname server benar');
      console.error('4. Instance name benar (jika menggunakan named instance)');
    }
    process.exit(1); // Hentikan aplikasi jika koneksi gagal
  }
}

// Jalankan test koneksi saat server start
testConnection();

// Endpoint untuk mengambil data PR
app.get('/api/data', async (req, res) => {
  try {
    console.log('Mencoba mengambil data PR...');
    const pool = await getConnection();
    
    const result = await pool.request().query(`
      SELECT 
        NO,
        NOMOR,
        JO,
        FORMAT(TANGGAL, 'dd/MM/yyyy') as TANGGAL,
        PROJECT,
        STATUS
      FROM PR_RawMaterial
      ORDER BY TANGGAL DESC
    `);
    
    console.log('Data berhasil diambil:', result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengakses database',
      error: err.message
    });
  }
});

// Endpoint untuk login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = await getConnection();
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .query(`
        SELECT 
          k.NIK,
          k.Nama,
          k.Departemen,
          k.Jabatan
        FROM Karyawan k
        WHERE k.Username = @username 
        AND k.Password = @password
      `);
    
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(401).json({ message: 'Username atau password salah' });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).send('Terjadi kesalahan saat login');
  }
});

// Endpoint untuk MTO
app.get('/api/mto', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        NO,
        NOMOR,
        JO,
        FORMAT(TANGGAL, 'dd/MM/yyyy') as TANGGAL,
        PROJECT,
        STATUS
      FROM MTO_RawMaterial
      ORDER BY TANGGAL DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengakses database',
      error: err.message
    });
  }
});

// Endpoint untuk menambah MTO baru
app.post('/api/mto', async (req, res) => {
  try {
    const { NOMOR, JO, TANGGAL, PROJECT } = req.body;
    const pool = await getConnection();
    const result = await pool.request()
      .input('nomor', sql.VarChar, NOMOR)
      .input('jo', sql.VarChar, JO)
      .input('tanggal', sql.Date, new Date(TANGGAL))
      .input('project', sql.VarChar, PROJECT)
      .query(`
        INSERT INTO MTO_RawMaterial (NOMOR, JO, TANGGAL, PROJECT, STATUS)
        VALUES (@nomor, @jo, @tanggal, @project, 'DRAFT')
        
        SELECT SCOPE_IDENTITY() as id
      `);
    res.json({ id: result.recordset[0].id, message: 'Data berhasil ditambahkan' });
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({
      message: 'Terjadi kesalahan saat menambah data',
      error: err.message
    });
  }
});

// Endpoint untuk menghapus MTO
app.delete('/api/mto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config);
    await sql.query`
      DELETE FROM MTO_RawMaterial
      WHERE NO = ${id}
    `;
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({
      message: 'Terjadi kesalahan saat menghapus data',
      error: err.message
    });
  } finally {
    await sql.close();
  }
});

// Endpoint untuk print preview MTO
app.get('/api/mto/:id/preview', async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config);
    const result = await sql.query`
      SELECT 
        m.*,
        FORMAT(m.TANGGAL, 'dd/MM/yyyy') as TANGGAL_FORMATTED
      FROM MTO_RawMaterial m
      WHERE m.NO = ${id}
    `;
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data preview',
      error: err.message
    });
  } finally {
    await sql.close();
  }
});

// Endpoint untuk memperbarui status MTO
app.put('/api/mto/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await sql.connect(config);
    await sql.query`
      UPDATE MTO_RawMaterial
      SET STATUS = ${status}
      WHERE NO = ${id}
    `;
    res.json({ message: 'Status berhasil diperbarui' });
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({
      message: 'Terjadi kesalahan saat memperbarui status',
      error: err.message
    });
  } finally {
    await sql.close();
  }
});

// Endpoint untuk Consumable PR
app.get('/api/consumable-pr', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT 
        NO,
        NOMOR,
        FORMAT(TANGGAL, 'dd/MM/yyyy') as TANGGAL,
        DEPARTEMEN,
        KETERANGAN,
        STATUS
      FROM PR_Consumable
      ORDER BY TANGGAL DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengakses database',
      error: err.message
    });
  } finally {
    await sql.close();
  }
});

// Endpoint untuk RAIR Consumable
app.get('/api/consumable-rair', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT 
        NO,
        NOMOR,
        FORMAT(TANGGAL, 'dd/MM/yyyy') as TANGGAL,
        DEPARTEMEN,
        KETERANGAN,
        STATUS
      FROM RAIR_Consumable
      ORDER BY TANGGAL DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengakses database',
      error: err.message
    });
  } finally {
    await sql.close();
  }
});

// Endpoint untuk menambah PR baru
app.post('/api/data', async (req, res) => {
  try {
    const { NOMOR, JO, TANGGAL, PROJECT } = req.body;
    await sql.connect(config);
    const result = await sql.query`
      INSERT INTO PR_RawMaterial (NOMOR, JO, TANGGAL, PROJECT, STATUS)
      VALUES (${NOMOR}, ${JO}, ${TANGGAL}, ${PROJECT}, 'DRAFT')
      
      SELECT SCOPE_IDENTITY() as id
    `;
    res.json({ id: result.recordset[0].id, message: 'Data berhasil ditambahkan' });
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({
      message: 'Terjadi kesalahan saat menambah data',
      error: err.message
    });
  } finally {
    await sql.close();
  }
});

// Endpoint untuk menghapus PR
app.delete('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config);
    await sql.query`
      DELETE FROM PR_RawMaterial
      WHERE NO = ${id}
    `;
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({
      message: 'Terjadi kesalahan saat menghapus data',
      error: err.message
    });
  } finally {
    await sql.close();
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
}); 