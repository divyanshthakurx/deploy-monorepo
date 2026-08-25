import express from "express";
import { prisma } from "db/client";
import "dotenv/config";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET!;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("test")
})


app.post("/signup", async (req,res) => {
    const {username, password} = req.body;

    try {
      const parsedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          username: username,
          password: parsedPassword
        },
      });

      res.status(200).json({
          message: "user created successfully"
      })

    } catch (error) {
      console.log("Error is: ", error)
    }
})

app.post("/signin", async (req,res) => {
    const {username, password} = req.body;

    try {

      const user = await prisma.user.findFirst({
        where: {
          username: username,
          password: password
        },
      });

      if(user){
        const parsedPassword = await bcrypt.compare(password, user.password);

        if(parsedPassword) {

          const token = jwt.sign({
            userId: user.id
          }, JWT_SECRET, {
            expiresIn: '10h'
          })

          res.status(200).json({
              data: user,
              token: token,
              message: "signin success"
          })
          // login
        }
      }

    } catch (error) {
      console.log("Error is", error);
    }

})

// app.post("/create-todo", async (req,res) => {
//     const {task, description, done} = req.body;

//     const newTodo = await prisma.todo.create({
//       data: {
//         task,
//         description,
//         done: done ?? false,
//         userId: req.userId,
//       },
//     });
// })

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})