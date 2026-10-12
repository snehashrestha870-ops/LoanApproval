import React from 'react';
import { useRouter } from 'next/router';

const FALLBACK_IMAGE = '/images/download.jpeg';

const SectionPart = ({ posts = [] }) => {
  const router = useRouter();

  const handleEditClick = async (e, slug) => {
    e.preventDefault();
    router.push(`/posts/${slug}`);
  };

  const getPostSlug = (post) => post.slug || post.blog_id;

  return (
    <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mt-10">
      <div className="flex items-center justify-between mb-4 ">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Latest Blog Posts
        </h5>
      </div>
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {posts.map((post) => {
            const postSlug = getPostSlug(post);
            const excerpt = post.description
              ? post.description.replace(/<[^>]*>/g, '').slice(0, 80)
              : 'Read the latest post.';

            return (
              <li key={post.blog_id || postSlug} className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={post.blog_image || FALLBACK_IMAGE}
                      alt="Author image"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {post.blog_name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {post.date}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <a
                    href={`/posts/${postSlug}`}
                    className="text-lg font-bold leading-6 text-gray-900 dark:text-white hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditClick(e, postSlug);
                    }}
                  >
                    {post.blog_name}
                  </a>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {excerpt}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SectionPart;
