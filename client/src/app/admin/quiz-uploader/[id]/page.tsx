import axios from "axios"
import Link from "next/link"
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const {id} = await params
    console.log(id)
    const response = await axios.get(`http://localhost:3000/api/admin/quiz/get-section/${id}`)
    // console.log(response)
    
    const section = response.data.res
    console.log(section)
    return (
        <>
            {section.map((item,index)=>(
                <Link key={index} href={`section/${id}`}>
                    <div>{item.title}</div>
                </Link>
                )
            )}
        </>
    )
}
export default page