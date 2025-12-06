"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    content: z.string().min(1, {
        message: "Answer must be at least 1 characters.",
    }),
    isCorrect: z.boolean(),
    itemId: z.string(),
})



const ChoiceCn = ({itemId}:{itemId:string}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toggle, setToggle] = useState(false)
    console.log(itemId)
    if (!itemId){
        return
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
            isCorrect: false,
            itemId: `${itemId}`
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            console.log(values)

            const response = await axios.post("http://localhost:3000/api/admin/quiz/choices", values)

            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`)
            // }

            // const data = await response.json()
            // console.log("Success:", data)

            // Reset form after successful submission
            form.reset()
            alert("บันทึกสำเร็จ!")

        } catch (error) {
            console.error("Error:", error)
            alert(`Error: ${error instanceof Error ? error.message : 'Something went wrong'}`)
        } finally {
            setIsSubmitting(false)
            setToggle(false)
        }
    }

    return (
        <>
            <div>
                <div onClick={() => setToggle(!toggle)}>เพิ่มคำตอบ</div>
                {toggle && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isCorrect"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center gap-3 m-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>

                                            <div className="flex items-center gap-1 text-sm font-medium leading-none">
                                                นี้เป็นคำตอบที่ถูกต้อง
                                            </div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "กำลังบันทึก..." : "Submit"}
                            </Button>
                        </form>
                    </Form>
                )}
            </div>
        </>
    )
}
export default ChoiceCn