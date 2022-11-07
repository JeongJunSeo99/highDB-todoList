const express = require("express"); 
const router = express.Router(); 
const mysql = require('mysql');  
const dbconfig = require('../config/db');
const connection = mysql.createConnection(dbconfig);

let today = new Date();   

let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1;  // 월
let date = today.getDate();  // 날짜

let t_date = (year + '-' + month + '-' + date);

router.post('/sign_up', (req,res)=>{ //회원가입
  console.log(req.body);
  connection.query('insert into user values(?,?,?,?);'
  , [req.body.email, req.body.password, req.body.name, t_date]
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    const result = {
      code: 200
    };
    res.send(result);
  });
});

router.post('/sign_in', (req,res)=>{ //로그인
  connection.query('select * from user where email = ? and password = ?;'
  , [req.body.email, req.body.password]
  , (error, rows) => {
    if (error) throw error;
    if(rows[0]){
      const result = {
        code: 200
      };
      res.send(result);
      console.log(rows[0]);
    }
    else{
      const result = {
        code: 400
      };
      res.send(result);
      console.log(rows);
    }
  });
});

router.post('/pw', (req,res)=>{ //비밀번호 변경
  connection.query('select * from user where email = ? and password = ?;'
  , [req.body.email, req.body.password]
  , (error, rows) => {
    if (error) throw error;
    if(rows[0]){
      connection.query('UPDATE user SET password = ? WHERE email = ?;'
      , [req.body.password_1, req.body.email]
      , (error, rows) => {
        if (error) throw error;
        else{
          const result = {
            code: 200
          };
          res.send(result);
        }
      });
    }
    else{
      const result = {
        code: 400
      };
      res.send(result);
      console.log(rows);
    }
  });
});

router.post('/sign_del', (req,res)=>{ //회원탈퇴
  connection.query('select * from todo_list1 where email = ?;'
  , [req.body.email]
  , (error, rows) => {
    if (error) throw error;
    
    if(rows[0]){
      connection.query('DELETE FROM todo_list1 WHERE email = ?;'
      , [req.body.email]
      , (error, rows) => {
       if (error) throw error;
      });
     

     connection.query('DELETE FROM category1 WHERE email = ?;'
    , [req.body.email]
    , (error, rows) => {
      if (error) throw error;
      });

      connection.query('DELETE FROM user WHERE email = ?;'
    , [req.body.email]
    , (error, rows) => {
      if (error) throw error;
      });

      const result = {
        code: 200
      };
      res.send(result);
    }
    else{
      connection.query('select * from category1 where email = ?;'
      , [req.body.email]
      , (error, rows1) => {
        if (error) throw error;

        if(rows1[0]){
         connection.query('DELETE FROM category1 WHERE email = ?;'
         , [req.body.email]
         , (error, rows) => {
          if (error) throw error;
         });

          connection.query('DELETE FROM user WHERE email = ?'
          , [req.body.email]
          , (error, rows) => {
          if (error) throw error;
          });

          const result = {
            code: 200
          };
          res.send(result);
       }
        else{
          connection.query('DELETE FROM user WHERE email = ?'
          , [req.body.email]
          , (error, rows2) => {
          if (error) throw error;
          });

          const result = {
            code: 200
          };
          res.send(result);
        }

      });

      const result = {
        code: 200
      };
      res.send(result);
    }
    
  });
});

router.post('/cat_cre', (req,res)=>{ //카테고리 생성
  connection.query('INSERT INTO category1 (title, created_at, email) VALUES (?, ?, ?);'
  , [req.body.title, t_date, req.body.email]
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    const result = {
      code: 200
    };
    res.send(result);
  });
});

router.post('/cat_re', (req,res)=>{ //카테고리 불러오기
  connection.query('select title from category1 where email = ?;'
  , [req.body.email]
  , (error, rows) => {
    if (error) throw error;
    if(rows[0]){
      var array = [];

      for(let i =0; i<rows.length;i++ ){
        array.push(rows[i].title);
      }
      const result = {
        title: array
      };
      res.send(result);

    }
    else{
      const result = {
        code: 400
      };
      res.send(result);
      console.log(rows);
    }
  });
});

router.post('/cat_del', (req,res)=>{ //카테고리 삭제
  console.log(req.body)
  connection.query('select * from category1 where email = ? and title = ?;'
  , [req.body.email, req.body.title]
  , (error, rows) => {
    if (error) throw error;
    
    if(rows[0]){
      
    
      connection.query('DELETE FROM todo_list1 WHERE email = ? and title = ?;'
      , [req.body.email, req.body.title]
      , (error, rows) => {
       if (error) throw error;
      });
     

     connection.query('DELETE FROM category1 WHERE email = ? and title = ?;'
    , [req.body.email, req.body.title]
    , (error, rows) => {
      if (error) throw error;
      });

      const result = {
        code: 200
      };
      res.send(result);
    }
    else{
      const result = {
        code: 400
      };
      res.send(result);
      console.log(rows);
    }
    
  });
});

router.post('/todo_cre', (req,res)=>{ //할 일 생성
  console.log(req.body);
  

  connection.query('INSERT INTO todo_list1(text, completed, date, email, title) VALUES (?, ?, ?, ?, ?);'
  , [req.body.text, 0, t_date, req.body.email, req.body.title]
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    const result = {
      code: 200
    };
    res.send(result);
    });
   
});

router.post('/todo_up', (req,res)=>{ //할 일 수정
  let r_today = new Date(req.body.date ); 
  let r_year = r_today.getFullYear(); // 년도
  let r_month = r_today.getMonth() + 1;  // 월
  let r_date = r_today.getDate();  //
  let req_date = (r_year + '-' + r_month + '-' + r_date);  
  connection.query('UPDATE todo_list1 SET title = ?, text = ? WHERE title = ? and text = ? and date = ? and email = ?;'
  , [req.body.title1, req.body.text1, req.body.title, req.body.text, req_date, req.body.email]
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    const result = {
      code: 200
    };
    res.send(result);
    });
            
  
});

router.post('/todo_re', (req,res)=>{ //할 일 불러오기
  connection.query('select todo_list1.text, todo_list1.completed, todo_list1.date, todo_list1.title from todo_list1 where email = ?;'
  , [req.body.email]
  , (error, rows) => {
    if (error) throw error;
    if(rows[0]){
      console.log(rows);
      res.send(rows);
    }
  });
});

router.post('/todo_del', (req,res)=>{ // 할 일 삭제
  console.log(req.body);
  let r_today = new Date(req.body.date); 
  let r_year = r_today.getFullYear(); // 년도
  let r_month = r_today.getMonth() + 1;  // 월
  let r_date = r_today.getDate();  //
  let req_date = (r_year + '-' + r_month + '-' + r_date);  
  connection.query('DELETE FROM todo_list1 WHERE text = ? and date = ? and email = ? and title = ?;'
  , [req.body.text, req_date, req.body.email, req.body.title]
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    const result = {
      code: 200
    };
    res.send(result);
    });

});

router.post('/todo_ch', (req,res)=>{ // 할 일 체크
  console.log(req.body);
  let r_today = new Date(req.body.date); 
  let r_year = r_today.getFullYear(); // 년도
  let r_month = r_today.getMonth() + 1;  // 월
  let r_date = r_today.getDate();  //   
  let req_date = (r_year + '-' + r_month + '-' + r_date);  
  connection.query('UPDATE todo_list1 SET completed = ? WHERE email = ? and title = ? and text = ? and date = ?;'
  , [req.body.complete, req.body.email, req.body.title, req.body.text, req_date ]
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    const result = {
      code: 200
    };
    res.send(result);
    });
});

router.get('/b1', (req,res)=>{ // 1. 전체 할 일을 개수에 따라 내림차순
  connection.query('SELECT text, count(text) FROM todo_list1 group by text ORDER BY count(text) DESC;'
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
});

router.get('/b2', (req,res)=>{ // 2. 카테고리가 생성된 순으로 유저 이름과 만든 카테고리 제목
  connection.query('SELECT u.created_at, u.name, c.title FROM user AS u JOIN category1 as c ON u.email = c.email ORDER BY u.created_at;'
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
});

router.get('/b3', (req,res)=>{ // 3. 동일한 카테고리를 가진 유저 이름과 카테고리 이름
  connection.query('SELECT title, name FROM user as u INNER JOIN (SELECT email, title FROM category1 WHERE title IN (SELECT title FROM category1 GROUP BY title HAVING COUNT(*) >1)) as c ON u.email = c.email;'
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
});

router.get('/b4', (req,res)=>{ // 4. 카테고리 생성 날짜와 같은 날에 만든 할 일
  connection.query('select YEAR(t.date) as year, MONTH(t.date) as month , DAY(t.date) as day, c.title, t.text FROM todo_list1 as t INNER JOIN category1 as c ON t.email = c.email and  t.title = c.title WHERE (SELECT YEAR(t.date) and MONTH(t.date) and DAY(t.date)) = (SELECT YEAR(c.created_at) and MONTH(c.created_at) and DAY(c.created_at));'
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
});

router.get('/b5', (req,res)=>{ // 5. 완료된 할 일이 가장 많은 유저의 이름과 할 일
  connection.query('SELECT ctg.name, count(*) FROM todo_list1  as lst INNER JOIN (SELECT c.email, title, u.name FROM category1 as c INNER JOIN (SELECT email, name FROM user) as u ON u.email = c.email) as ctg ON ctg.email = lst.email and ctg.title = lst.title where completed = 1 group by ctg.name limit 1;'
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
});

module.exports = router;

/*
# 1. 전체 할 일을 개수에 따라 내림차순
#SELECT text, count(text) FROM todo_list group by text ORDER BY count(text) DESC;

# 2. 카테고리가 생성된 순으로 유저 이름과 만든 카테고리 제목
#SELECT u.created_at, u.name, c.title FROM user AS u 
#JOIN category as c ON u.email = c.email ORDER BY u.created_at;

# 3. 동일한 카테고리를 가진 유저 이름과 카테고리 이름
#SELECT category_id, u.name FROM category INNER JOIN (
SELECT title, name FROM user as u INNER JOIN
(SELECT email, title FROM category WHERE title 
IN (SELECT title FROM category GROUP BY title HAVING COUNT(*) >1)) as c 
ON u.email = c.email;


# 4. 카테고리 생성 날짜와 같은 날에 만든 할 일
#select YEAR(t.created_at) as year, MONTH(t.created_at) as month , DAY(t.created_at) as day, title, text
#FROM todo_list as t INNER JOIN category as c ON t.category_id = c.category_id
#WHERE (SELECT YEAR(t.created_at) and MONTH(t.created_at) and DAY(t.created_at)) =
#(SELECT YEAR(c.created_at) and MONTH(c.created_at) and DAY(c.created_at));

# 5. 완료된 할 일이 가장 많은 유저의 이름과 할 일
#SELECT ctg.name, lst.text FROM todo_list as lst INNER JOIN 
#(SELECT category_id, u.name 
#   FROM category as c INNER JOIN (SELECT email, name FROM user limit 1) as u 
#   ON u.email = c.email) as ctg 
#ON ctg.category_id = lst.category_id;
*/






























































/*
router.post('/sign_del', (req,res)=>{ //회원탈퇴
  connection.query('select * from category where email = ?;'
  , [req.body.email]
  , (error, rows) => {
    if (error) throw error;
    
    if(rows[0]){
      
     for(var i=0; i < rows.length; i++){
      connection.query('DELETE FROM todo_list WHERE category_id = ?;'
      , [rows[i].category_id]
      , (error, rows) => {
       if (error) throw error;
      });
     }

     connection.query('DELETE FROM category WHERE email = ?'
    , [req.body.email]
    , (error, rows) => {
      if (error) throw error;
      });

      connection.query('DELETE FROM user WHERE email = ?'
    , [req.body.email]
    , (error, rows) => {
      if (error) throw error;
      });

      const result = {
        code: 200
      };
      res.send(result);
    }
    else{
      connection.query('DELETE FROM user WHERE email = ?'
    , [req.body.email]
    , (error, rows) => {
      if (error) throw error;
      });

      const result = {
        code: 200
      };
      res.send(result);
    }
    
  });
});

router.get('/sign_del_recovery', (req,res)=>{ //회원탈퇴
  connection.query('INSERT INTO user VALUES ("32203660@gmail.com", "1111", "H1", "22-11-01");'
  //, [new Date('22-11-01')]
  , (error, rows) => {
    if (error) throw error;
  });
  connection.query('INSERT INTO category VALUES (1,"학교", "22-11-02" ,null,"32203660@gmail.com")'
  , (error, rows) => {
    if (error) throw error;
  });
  connection.query('INSERT INTO category VALUES (2,"과제", "22-11-02",null,"32203660@gmail.com");'
  , (error, rows) => {
    if (error) throw error;
  });
  connection.query('INSERT INTO todo_list VALUES (1,"고DB 공부하기", 1, "22-11-02", null, null, 1);'
  , (error, rows) => {
    if (error) throw error;
  });
  connection.query('INSERT INTO todo_list VALUES (2,"고DB 수업듣기", 0, "22-11-02", "2022-11-02 05:18:00", null, 1);'
  , (error, rows) => {
    if (error) throw error;
  });
  connection.query('INSERT INTO todo_list VALUES (3,"고DB 과제하기", 0, "22-11-03", "2022-11-03 05:19:00", null, 2);'
  , (error, rows) => {
    if (error) throw error;
  });
  res.send("sucess");
});

router.post('/cat_cre', (req,res)=>{ //카테고리 생성
  connection.query('INSERT INTO category (title, created_at, email) VALUES (?, ?, ?, ?);'
  , [req.body.title, t_date, req.body.email]
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    const result = {
      code: 200
    };
    res.send(result);
  });
});

router.post('/cat_re', (req,res)=>{ //카테고리 불러오기
  connection.query('select title from category where email = ?;'
  , [req.body.email]
  , (error, rows) => {
    if (error) throw error;
    if(rows[0]){
      var array = [];

      for(let i =0; i<rows.length;i++ ){
        array.push(rows[i].title);
      }
      const result = {
        title: array
      };
      res.send(result);

    }
    else{
      const result = {
        code: 400
      };
      res.send(result);
      console.log(rows);
    }
  });
});

router.post('/cat_del', (req,res)=>{ //카테고리 삭제
  console.log(req.body)
  connection.query('select * from category where email = ? and title = ?;'
  , [req.body.email, req.body.title]
  , (error, rows) => {
    if (error) throw error;
    
    if(rows[0]){
      
    
      connection.query('DELETE FROM todo_list WHERE category_id = ?;'
      , [rows[0].category_id]
      , (error, rows) => {
       if (error) throw error;
      });
     

     connection.query('DELETE FROM category WHERE email = ? and title = ?'
    , [req.body.email, req.body.title]
    , (error, rows) => {
      if (error) throw error;
      });

      const result = {
        code: 200
      };
      res.send(result);
    }
    else{
      const result = {
        code: 400
      };
      res.send(result);
      console.log(rows);
    }
    
  });
});

router.post('/todo_cre', (req,res)=>{ //할 일 생성
  console.log(req.body);
  

    connection.query('select * from category where email = ? and title = ?;'
  , [req.body.email, req.body.title]
  , (error, rows) => {
    if (error) throw error;
    
    if(rows[0]){
      connection.query('INSERT INTO todo_list(text, completed, date, created_at, category_id) VALUES (?, ?, ?, ?, ?, ?);'
    , [req.body.text, 0, t_date, t_date, rows[0].category_id]
    , (error, rows) => {
      if (error) throw error;
      console.log(rows);
      const result = {
        code: 200
      };
      res.send(result);
      });
    }
    else{
      const result = {
        code: 400
      };
      res.send(result);
    }  
  });
   
});

router.post('/todo_up', (req,res)=>{ //할 일 수정
  connection.query('select * from category where email = ? and title = ?;'
  , [req.body.email, req.body.title]
  , (error, rows) => {
    if (error) throw error;
    console.log(req.body);
    console.log(rows[0]);
    if(rows[0]){
      connection.query('select * from category where email = ? and title = ?;'
      , [req.body.email, req.body.title1]
      , (error, rows1) => {
        if (error) throw error;
        console.log(rows1[0]);
        if(rows1[0]){
          let r_today = new Date(req.body.date ); 
          let r_year = r_today.getFullYear(); // 년도
          let r_month = r_today.getMonth() + 1;  // 월
          let r_date = r_today.getDate();  // 날짜

          let req_date = (r_year + '-' + r_month + '-' + r_date);  
          connection.query('UPDATE todo_list SET category_id = ?, text = ? WHERE category_id = ? and text = ? and date = ?;'
          , [rows1[0].category_id, req.body.text1, rows[0].category_id, req.body.text, req_date ]
          , (error, rows) => {
            if (error) throw error;
            console.log(rows);
            const result = {
              code: 200
            };
            res.send(result);
            });
        }
        else{
          const result = {
            code: 400
          };
          res.send(result);
        } 
  
      });
      
    }
    else{
      const result = {
        code: 400
      };
      res.send(result);
    }  
  });
});

router.post('/todo_re', (req,res)=>{ //할 일 삭제
  connection.query('select todo_list.text, todo_list.completed, todo_list.date, category.title from todo_list inner join category on todo_list.category_id = category.category_id where category.email = ?;'
  , [req.body.email]
  , (error, rows) => {
    if (error) throw error;
    if(rows[0]){
      console.log(rows);
      res.send(rows);
    }
  });
});

router.post('/todo_del', (req,res)=>{ // 할 일 조회
  console.log(req.body);
  connection.query('select * from category where email = ? and title = ?;'
  , [req.body.email, req.body.title]
  , (error, rows) => {
    if (error) throw error;
      let r_today = new Date(req.body.date ); 
      let r_year = r_today.getFullYear(); // 년도
      let r_month = r_today.getMonth() + 1;  // 월
      let r_date = r_today.getDate();  // 날짜

      let req_date = (r_year + '-' + r_month + '-' + r_date);  

    if(rows[0]){
      connection.query('DELETE FROM todo_list WHERE text =? and date = ? and category_id = ?;'
      , [req.body.text, req_date, rows[0].category_id]
      , (error, rows) => {
        if (error) throw error;
        console.log(rows);
        const result = {
          code: 200
        };
        res.send(result);
        });
    }
    else{
      const result = {
        code: 400
      };
      res.send(result);
    }  
  });
});

router.post('/todo_ch', (req,res)=>{ // 할 일 체크
  connection.query('select * from category where email = ? and title = ?;'
  , [req.body.email, req.body.title]
  , (error, rows) => {
    if (error) throw error;
    
    if(rows[0]){
      console.log(rows[0].category_id);
      let r_today = new Date(req.body.date); 
      let r_year = r_today.getFullYear(); // 년도
      let r_month = r_today.getMonth() + 1;  // 월
      let r_date = r_today.getDate();  // 날짜

      let req_date = (r_year + '-' + r_month + '-' + r_date);  
      connection.query('UPDATE todo_list SET completed = ? WHERE category_id = ? and text = ? and date = ?;'
      , [req.body.completed, rows[0].category_id, req.body.text, req_date ]
      , (error, rows) => {
        if (error) throw error;
        console.log(rows);
        const result = {
          code: 200
        };
        res.send(result);
        });
    }
    else{
      const result = {
        code: 400
      };
      res.send(result);
    }  
  });
});

router.get('/b1', (req,res)=>{ // 할 일 체크
  connection.query('SELECT text, count(text) FROM todo_list group by text ORDER BY count(text) DESC;'
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
});

router.get('/b2', (req,res)=>{ // 할 일 체크
  connection.query('SELECT u.created_at, u.name, c.title FROM user AS u JOIN category as c ON u.email = c.email ORDER BY u.created_at;'
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
});

router.get('/b3', (req,res)=>{ // 할 일 체크
  connection.query('SELECT category.title, u.name FROM category INNER JOIN (SELECT title, name FROM user as u INNER JOIN(SELECT email, title FROM category WHERE title IN (SELECT title FROM category GROUP BY title HAVING COUNT(*) >1)) as c ON u.email = c.email)u'
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
});

router.get('/b4', (req,res)=>{ // 할 일 체크
  connection.query('select YEAR(t.created_at) as year, MONTH(t.created_at) as month , DAY(t.created_at) as day, title, text FROM todo_list as t INNER JOIN category as c ON t.category_id = c.category_id WHERE (SELECT YEAR(t.created_at) and MONTH(t.created_at) and DAY(t.created_at)) = (SELECT YEAR(c.created_at) and MONTH(c.created_at) and DAY(c.created_at));'
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
});

router.get('/b5', (req,res)=>{ // 할 일 체크
  connection.query('SELECT ctg.name, lst.text FROM todo_list as lst INNER JOIN (SELECT category_id, u.name FROM category as c INNER JOIN (SELECT email, name FROM user limit 1) as u ON u.email = c.email) as ctg ON ctg.category_id = lst.category_id;'
  , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
});

module.exports = router;*/