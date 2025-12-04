import axios from "axios"
import Link from "next/link"
export default async function Quiz() {
    const response = await axios.get("http://localhost:3000/api/admin/quiz/get-material")
    console.log(response)
    const material = response.data.res
    return (
        <>
            {material.map((item, index) => {
                return (
                    <Link key={index} href={`/admin/quiz-uploader/${item.id}`}>
                        <div className="my-4">{item.title}</div>
                    </Link >
                )
})}
        </>
    )
}