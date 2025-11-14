import { PageContainer } from "@/components/page-container"
import { SingleMajorClient } from "./single-major-client"
import { getEducationData } from "@/lib/education-data"

export default function SingleMajorPage() {
  const educationData = getEducationData()

  return (
    <PageContainer>
      <SingleMajorClient educationData={educationData} />
    </PageContainer>
  )
}
