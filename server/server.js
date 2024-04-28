const express = require('express');
const app = express();
let cors = require('cors');
const mariadb = require('mariadb');
const { Pool } = require('pg');

require('dotenv').config();
const {
  CLIENT_PORT,
  SERVER_PORT,
  NODE_ENV,
  MARIA_HOST,
  MARIA_PORT,
  MARIA_DB,
  MARIA_USER,
  MARIA_PW,
  PG_HOST,
  PG_PORT,
  PG_DB,
  PG_SCHEMA,
  PG_USER,
  PG_PW
  } = process.env
app.use(cors({origin: "http://localhost:"+CLIENT_PORT, credentials: true}))
app.set("trust proxy", 1);

app.use(express.urlencoded( {extended : false } ));// bodyparser
app.use(express.json()); // bodyparser

// Mariadb 연결 설정
const mariadbPool = mariadb.createPool({
  host: MARIA_HOST,
  port: MARIA_PORT,
  user: MARIA_USER,
  password: MARIA_PW,
  database: MARIA_DB
});
// PostgreSQL 연결 설정
const postgresPool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DB,
  password: PG_PW,
  port: PG_PORT,
});



app.get('/', async (req, res) => {
  let mariaConn;
  let pgConn;
  try {
    // Mariadb 연결 확인
    mariaConn = await mariadbPool.getConnection();
    mariaConn.release();
    // PostgreSQL 연결 확인
    pgConn = await postgresPool.connect();
    pgConn.release();
    const mariaTest = await mariaConn.query('SELECT * FROM test');
    const pgTest = await pgConn.query(`SELECT * FROM ${PG_SCHEMA}.test`);
    if (mariaTest.length >= 0 && pgTest.rows.length >= 0) {
      console.log(pgTest.rows);
      console.log(mariaTest);
    } else {
      throw new Error('디비 접속에 실패하였습니다.');
    }

    res.status(200).send('홈 페이지입니다.');
  } catch (error) {
    console.error('데이터베이스 연결 오류:', error.message);
    res.status(500).send('서버 내부 오류');
  }
});

//  작업할 라우터들
//const aPage = require('./routes/api/a)
// app.use('/a', aPage);
// 간단한거는 걍 이렇게 처리
// app.get('/b', (req, res) => {
//   res.send('A 페이지입니다.');
// });


// 상위에 명시된 경로가 아닌 경로는 다 아래로 탐
// 404 오류 핸들링
app.use((req, res, next) => {
  const error = new Error('요청한 페이지를 찾을 수 없습니다.');
  error.status = 404;
  next(error); // 
});

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  // 클라이언트 오류인 경우
  if (err.status >= 400 && err.status < 500) {
    res.status(err.status).send(err.message || '잘못된 요청입니다.');
  } else {
    // 서버 오류인 경우
    res.status(err.status || 500).send(err.message || '서버 내부 오류');
  }
});

app.listen(SERVER_PORT, () => {
  console.log('This app is running at http://localhost:' + SERVER_PORT)
}).on('error', (err) => { 
  console.log('Something went wrong' + err.message)
})