import axios from "axios"
import Link from "next/link"
const page = async ({ params }: { params: Promise<{ materialId: string }> }) => {
    const {materialId} = await params
    console.log(materialId)
    const response = await axios.get(`http://localhost:3000/api/admin/quiz/get-material/detail/${materialId}`)
    // console.log(response)
    
    const section = response.data.res
    console.log(section)
    return (
        <>
            {section.map((item,index)=>(
                <Link key={index} href={`${materialId}/section/${item.id}`}>
                    <div>{item.title}</div>
                </Link>
                )
            )}
        </>
    )
}
export default page