import { getTopicById, getAdjacentTopics } from '@/data/day0to1Topics';
import { getLesson, hasLesson } from '@/data/content';
import LessonView from './LessonView';
import type { AdjacentTopic } from './LessonView';

/**
 * Server Component wrapper for a Phase 0 lesson.
 *
 * This page used to be a Client Component that imported `@/data/content`
 * directly. That index eagerly concatenates the C++, Java and Python lesson
 * arrays, so the bundler had to ship **all 478 lessons** — a single 1.7MB
 * chunk — to anyone opening any one lesson. A student reading Java on mobile
 * data was downloading the entire C++ and Python curriculum too.
 *
 * Resolving the lesson here keeps the content on the server: only the one
 * lesson the student actually asked for crosses the wire, inside the RSC
 * payload. `LessonView` holds all the interactive behaviour (session, progress
 * checkbox, language switch) and receives plain serializable props.
 */
export default async function LessonPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;

  const topic = getTopicById(topicId);
  const lesson = getLesson(topicId);
  const { prev, next } = getAdjacentTopics(topicId);

  // `hasLesson` drives the "no lesson yet" flag on the prev/next links. Resolve
  // it here so the client never needs the content index to answer it.
  const toAdjacent = (t: typeof prev): AdjacentTopic | null =>
    t ? { id: t.id, title: t.title, hasLesson: hasLesson(t.id) } : null;

  return (
    <LessonView
      topicId={topicId}
      topic={topic ?? null}
      lesson={lesson}
      prev={toAdjacent(prev)}
      next={toAdjacent(next)}
    />
  );
}
