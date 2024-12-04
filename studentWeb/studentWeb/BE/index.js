const express = require('express');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3')

app.use(express.json());
app.use(cors()); // Allow requests from other origins

let justcheckMSSV = null;

const conn = new sqlite3.Database('C:/Users/Nameless/Desktop/Newfolder/IOT_BE/facerecognition_system/db.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

const getFormattedTimestamp = () => {
  const now = new Date();

  // Lấy các thành phần thời gian
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(6, '0'); // Thêm "000" để lên 6 chữ số

  // Kết hợp các thành phần
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};
// PATCH API - Update student check in status with rfid
app.post('/video/rfids', (req, res) => {
  const { rfid } = req.body;
  console.log(req.body);

  conn.get("SELECT mssv FROM video_processing_facerecognition WHERE id_card = ?", [rfid], (err, row) => {

    if (err) {
      return res.status(500).json({ message: 'query fail' });
    }

    if (!row) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const mssv = row.mssv


    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const start = startOfDay.toISOString();
    const end = endOfDay.toISOString();

    const timestamp = getFormattedTimestamp();

    conn.get(
      "SELECT * FROM video_processing_attendance WHERE student_id = ? AND timestamp BETWEEN ? AND ?",
      [mssv, start, end],
      (err, existingRecord) => {
        if (err) {
          console('checking erro')
        }

        if (existingRecord) {
          console.log('sv hom nay da diem danh')
          return res.status(200).json({ message: 'Sinh viên hôm nay đã điểm danh' });
        }
        conn.run("INSERT INTO video_processing_attendance ( timestamp, status, student_id) VALUES (?, ?, ?)", [timestamp, 'Yes', mssv], (err) => {
          if (err) {
            console.log('Reg fail');
            return res.status(500).json({ message: 'Error recording attendance' });
          }
          justcheckMSSV = mssv;
          res.json({ message: 'reg success' });
        });
      })
  });
});

// app.get('/attendance/lastcheck', (req, res) => {
//   if (lastCheckedInMSSV) {
//     res.json({ message: `Student ${justcheckMSSV} has successfully checked in.` });
//     justcheckMSSV = null;
//   } else {
//     res.status(404).json({ message: 'No recent attendance record found.' });
//   }
// });

// Start the server
const PORT = 6969;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
