"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const choiceForm = z.object({
  content: z.string(),
  isCorrect: z.boolean(),
})

export type zodType = z.infer<typeof choiceForm>;

const Choice = () => {
  const [showAnswer, setshowAnswer] = useState(false)
  const [content, setContent] = useState("ไม่ได้ระบุคำตอบ")

  //form
  const { register, handleSubmit, formState: { errors } } = useForm<zodType>({
    resolver: zodResolver(choiceForm)
  })

  const handleInsertChoice = async (choices: zodType) => {
    console.log("EZ")
    const choice = await axios.post("http://localhost:3000/api/admin/quiz/choices", choices)
  }

  return (
    <>
      <div>{content}</div>
      <button onClick={() => setshowAnswer(!showAnswer)}>Insert</button>
      {showAnswer && 
      <div className="bg-blue-400 border-2">
        <form onSubmit={handleSubmit((data) => handleInsertChoice(data))}>
          <input placeholder="Enter your answer" {...register("content")}></input>
          <input placeholder="Is your answer correct" type="checkbox" {...register("isCorrect")}></input>
          <button type="submit" className="border-2">Insert</button>
        </form>
      </div>}
    </>
  )
}
export default Choice