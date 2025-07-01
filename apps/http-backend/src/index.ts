import express, { Request, Response } from "express";
import { prisma } from "@repo/db/db";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());

app.post("/todo", async (req: Request, res: Response): Promise<any> => {
  const { message, description } = req.body;

  const todo = await prisma.todo.create({
    data: {
      message,
      description,
    },
  });

  return res.status(200).json({ message: "todo added", todo });
});

app.listen(PORT, () => {
  console.log("server is runing on port", PORT);
});
