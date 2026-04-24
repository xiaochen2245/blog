import PostList from "./PostList";
import { getAllPosts, getAllTags } from "@/lib/posts";

export default async function Home() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  return <PostList posts={posts} allTags={allTags} />;
}