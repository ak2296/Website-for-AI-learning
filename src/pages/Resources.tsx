// src/pages/Resources.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function Resources() {
  // Define the query key as a readonly tuple.
  const queryKey = ['posts'] as const;

  const { data, isLoading, error } = useQuery<Post[], Error>({
    queryKey,
    queryFn: async (): Promise<Post[]> => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      if (!res.ok) {
        throw new Error('Error fetching posts');
      }
      const json = await res.json();
      console.log('Fetched data:', json); // Debug: view fetched data in browser console
      return json as Post[];
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const posts: Post[] = data ?? [];
  if (posts.length === 0) {
    // This will render if the posts array is empty.
    return <div>No posts found.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h1 className="text-2xl font-bold">Resources</h1>
      {posts.map((post) => (
        <div key={post.id} className="p-4 bg-gray-200 dark:bg-gray-700 rounded shadow">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </motion.div>
  );
}
