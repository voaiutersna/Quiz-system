import axios from "axios"
import ChoiceCn from "../../../../../../../components/choiceform"
const page = async ({ params }: { params: Promise<{ sectionId: string }> }) => {
    const {sectionId} = await params
    console.log(sectionId)

    const response = await axios.get(`http://localhost:3000/api/admin/quiz/get-section/detail/${sectionId}`)
    // console.log(response)
    const quizItem = response.data.res.quizItems
    const section= response.data.res.section[0]
    console.log("GET Item",quizItem)
    console.log(section)
  return (
    <>
      <div>{section.title}</div>
      <div>{section.totalScore}</div>
      <div>
        {quizItem.map((item:any,index:number)=>(
          <div key={index}>
            {item.content}
            <ChoiceCn itemId={item.id}></ChoiceCn>
          </div>
        ))}
      </div>
    </>
  )
}
export default page