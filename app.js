const express = require ("express");
require ("dotenv").config()
const jwt = require('jsonwebtoken');
const cors = require ("cors");
const { resetPassword } = require("./controller/user.controller");
const connectDB = require ("./db/database");
const userRoutes = require("./router/user.routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.set ('view engine', 'ejs');

let user = {
  // id: "compactpay",
  // email: "compactpay22@gmail.com",
  // password: "compact22",
  
}
const JWT_SECRET = 'COMPACTPAY2022'

connectDB();
const port = process.env.PORT || 5678;

app.get("/", (req, res) => {
  return res.status(200).json({ message: "home page 😊😊😊😊😊" });
});
app.get('/forgotPassword',(req, res, next) => {
  res.render('forgotPassword');
})

app.post('/forgotPassword', (req, res, next) =>{
  const { email } = req.body;
  if (email !== user.email) {
    // res.send('user does not exist')
    // return;
  }
  res.send(email);

  const secret = JWT_SECRET + user.Password
  const payload = {
    email: user.email,
    id: user.id
  }

  const token = jwt.sign (payload, secret, {expiresIn: '15m'})
  const link = 'http://localhost:5678/reset-password/${user.id}/${token}'
  console.log(link)
  res.send('Password reset link has been sent to your email')
});


app.get('/resetPassword/:id/:token',(req, res, next) =>{
const { id, token } = req.
res.send(req.params)


if (id !== user.id){
  res.send('invalid id')
  return
}

const secret = JWT_SECRET + user.password
try {
  const payload = jwt.verify(token, secret)
res.render('reset-password',{email:user.email})

} catch (error) {
  console.log(error.message);
  res.send(error.message);
}
});
app.post("/resetPassword/:id/:token", (req, res, next) => {
  const { id, token } = req.params;
  res.send(user);

});


app.use("/api/users", userRoutes);
// app.use("/api/news", newsRoutes);

app.use(
  cors({
    credentials: true,
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.all("*", (req, res) => {
  res.status(404).json({ message: "😒😒😒 oops page not found" });
});

app.listen(port, () => {
  console.log(`app running on port ${port}`);
  console.log(process.env.NODE_ENV);
});
