const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
var mysql = require('mysql');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'agus',
    password: '1234',
    database: 'tokokasih',
    port    : 3305,  
    multipleStatements:true
});


const PORT = 4000 //harus 4 digit bebas
const app = express()
var arrProducts = [
    {
        "id": 1,
        "nama": 'Popok Hokage',
        "description": 'sensasi hokage di sejak dini',
        "harga": 5000
    },
    {
        "id": 4,
        "nama": 'Popok Naruto',
        "description": 'ninja adalah jalan popokku',
        "harga": 10000
    }
]

app.use(cors())
app.use(bodyParser.json())

/*----------------get---------------*/
app.get('/', (req, res) => {
    res.status(202).send('<h1>Anda berada di negara API</h1>')
})

app.get('/categories', (req,res)=>{    
    console.log(req.query); 
    const query = `SELECT * from namaCat;`
    
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        };
        console.log('error : ', err)
        console.log('results : ',results)

        res.status(200).send(results)
      });
})

app.get('/products', (req,res)=>{    
    console.log(req.query); 
    const query = `select * from products;`
    
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        };
        console.log('error : ', err)
        console.log('results : ',results)

        res.status(200).send(results)
      });
})

app.get('/productcat', (req,res)=>{    
    console.log(req.query); 
    const query = `select pc.id, p.nama as product, c.category from products p join productcat pc on p.id = pc.productid join categories c on c.id = pc.categoryid;;`
    
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        };
        console.log('error : ', err)
        console.log('results : ',results)

        res.status(200).send(results)
      });
})

app.get('/leafcat', (req,res)=>{    
    console.log(req.query); 
    const query = `SELECT  c1.id, c1.category
    FROM categories c1
    LEFT JOIN categories c2 ON c2.parentid = c1.id
    WHERE c2.id IS NULL;`
    
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        };
        console.log('error : ', err)
        console.log('results : ',results)

        res.status(200).send(results)
      });
})



/*---------------tambah/post------------------*/
app.post('/categories', (req,res) => {
    console.log('Query : ', req.query);
    console.log('Body : ',req.body);

    const query = `INSERT INTO categories SET ? ;`
    connection.query(query, req.body, (err,results)=>{
        if(err){
            return res.status(500).send(err)
        }
        console.log(results);
        res.status(200).send(results);
    })
})

app.post('/products', (req,res) => {
    console.log('Query : ', req.query);
    console.log('Body : ',req.body);

    const query = `INSERT INTO products SET ? ;`
    connection.query(query, req.body, (err,results)=>{
        if(err){
            return res.status(500).send(err)
        }
        console.log(results);
        res.status(200).send(results);
    })
})

app.post('/productcat/:id', (req,res) => {
    console.log('Query : ', req.query);
    console.log('Body : ',req.body);

    const pID = `select c.id from products p join productcat pc on p.id = pc.productid join categories c on c.id = pc.categoryid
    where p.id = ${req.params.id}`
    while(pID){
        const query = `INSERT INTO productcat values (null, (select c.id from products p join productcat pc on p.id = pc.productid join categories c on c.id = pc.categoryid where p.id = ${req.params.id}), (select c.id as parent from products p join productcat pc on p.id = pc.productid join categories c on c.id = pc.categoryid
            where p.id = ${req.params.id})) ;`
        connection.query(query, req.body, (err,results)=>{
            if(err){
                return res.status(500).send(err)
            }
            console.log(results);
            res.status(200).send(results);
            pID += 1
        })
    }
})

/*---------------edit------------------*/
app.put('/categories/:id', (req,res) => {
    console.log(req.params);
    console.log(req.body);
    
    const query = `UPDATE categories SET ? where id = ${(req.params.id)}`
    console.log(query);
    connection.query(query, req.body, (err, results) => {
        if(err){
            return res.status(500).send(err)
        }
        console.log(results);
        return res.status(200).send(results)
        
    })
})

app.put('/products/:id', (req,res) => {
    console.log(req.params);
    console.log(req.body);
    
    const query = `UPDATE products SET ? where id = ${(req.params.id)}`
    console.log(query);
    connection.query(query, req.body, (err, results) => {
        if(err){
            return res.status(500).send(err)
        }
        console.log(results);
        return res.status(200).send(results)
        
    })
})
// insert into productcat values (null, 9,2), (null,8,2), (null,5,2);
/*----------delete---------------*/
app.delete('/categories/:id',(req,res) => {
    console.log(req.params);
    
    const query = `DELETE FROM categories WHERE id = ${req.params.id}`
    console.log(query);
    connection.query(query, (err, results) => {
        if(err){
            return res.status(500).send(err)
        }
        console.log(results);
        return res.status(200).send(results)
    })
})

app.delete('/products/:id',(req,res) => {
    console.log(req.params);
    
    const query = `DELETE FROM products WHERE id = ${req.params.id}`
    console.log(query);
    connection.query(query, (err, results) => {
        if(err){
            return res.status(500).send(err)
        }
        console.log(results);
        return res.status(200).send(results)
    })
})

app.delete('/productcat/:id',(req,res) => {
    console.log(req.params);
    
    const query = `DELETE FROM productcat WHERE productid = ${req.params.id}`
    console.log(query);
    connection.query(query, (err, results) => {
        if(err){
            return res.status(500).send(err)
        }
        console.log(results);
        return res.status(200).send(results)
    })
})


app.listen(PORT, () => console.log(`API berkobar di ${PORT}`))


/*---------postman body-------------*/
// {
// 	"id" : null,
// 	"category" : "Boxer",
// 	"parentId" : 12
// }

// {
//     "id" : null,
//     "nama" : "Kemeja Executive",
//     "description" : "Kemeja formal berkualitas",
//     "harga" : 150000
// }