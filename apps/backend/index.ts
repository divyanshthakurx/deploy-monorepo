import express from "express";
import { prisma } from "db/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import cors from "cors";
import { authUser } from "./middleware/auth";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT!;
const JWT_SECRET = process.env.JWT_SECRET!;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("test")
})

app.post("/signup", async (req,res) => {
    const username = req.body?.username;
    const password = req.body?.password;

    if(!username || !password) {
      res.json({
        message: "valid username and password required"
      })
      return
    }

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
    const username = req.body?.username;
    const password = req.body?.password;

    if(!username || !password) {
      res.json({
        message: "valid username and password required"
      })
      return
    }

    try {

      const user = await prisma.user.findFirst({
        where: {
          username: username
        },
      });

      if(user) {
        const parsedPassword = await bcrypt.compare(password, user.password);

        if(!parsedPassword) {
          res.json({
            message: "credenrials invalid"
          })
          return
        }

        const token = jwt.sign({
          userId: user.id 
        }, JWT_SECRET, {
          expiresIn: '10h'
        })

        res.cookie("token", token);
        res.status(200).json({
            data: user,
            token: token,
            message: "signin success"
        })
        // login

      }

    } catch (error) {
      console.log("Error is", error);
    }

})

app.post("/todo", authUser ,async (req,res) => {
  const task = req.body?.task;
  const description = req.body?.description;
  const done = req.body?.done;

  //@ts-ignore
  const currentUserId = req.userId;
  
  const newTodo = await prisma.todo.create({
    data: {
      task,
      description,
      done: done ?? false,
      userId: currentUserId,
    },
  });

  res.send(newTodo);
  res.json({
    message: "new todo created",
    newTodo
  });
});

app.listen(PORT, () => {
    console.log("Database URL loaded:", process.env.DATABASE_URL);
    console.log(`server is running on ${PORT}`)
})