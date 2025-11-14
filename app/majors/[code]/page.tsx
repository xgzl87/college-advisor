import { fetchMajorsData, groupByEduLevel, EDU_LEVEL_LABELS } from "@/lib/majors-data"
import { MajorDetailClient } from "./major-detail-client"

export default async function MajorDetailPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const allMajors = await fetchMajorsData()
  const currentMajor = allMajors.find((m) => m.code.toString() === code)

  if (!currentMajor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">专业未找到</h1>
          <p className="text-muted-foreground">该专业信息不存在</p>
        </div>
      </div>
    )
  }

  const groupedMajors = groupByEduLevel(allMajors)

  return (
    <MajorDetailClient currentMajor={currentMajor} groupedMajors={groupedMajors} eduLevelLabels={EDU_LEVEL_LABELS} />
  )
}
