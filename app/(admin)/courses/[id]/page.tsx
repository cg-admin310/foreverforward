import { notFound } from "next/navigation";
import { getCourse } from "@/lib/actions/courses";
import { CourseEditor } from "./course-editor";

export const dynamic = "force-dynamic";

export default async function CourseEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getCourse(id);
  if (!res.success || !res.data) notFound();
  return <CourseEditor detail={res.data} />;
}
