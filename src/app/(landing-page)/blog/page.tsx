import HorizontalBlogView from '@components/horizontal-blog-view';
import NewsDisplayer from '@components/news-displayer';
import VericalBlogView from '@components/vertical-blog-view';
import { absoluteUrl } from '@lib/helper';
import { Divider } from '@nextui-org/divider';
import { Post, User } from '@prisma/client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blogs',
};

async function getPosts() {
  const params = new URLSearchParams({
    published: 'true',
  });
  const url = absoluteUrl(`/api/blog?${params.toString()}`);
  const res = await fetch(url, {
    next: {
      revalidate: 60,
      tags: ['blog'],
    },
    method: 'GET',
  })
    .then(async (res) => {
      if (!res.ok) {
        console.log('Error when fetching posts', res);
      }
      const data = await res.json();
      return data.data as (Post & { author: Pick<User, 'id' | 'name' | 'image'> })[];
    })
    .catch((e) => {
      return [];
    });

  return res;
}

async function BlogPage() {
  const posts = await getPosts();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-4 container mx-auto">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        <NewsDisplayer
          className="col-span-2"
          header={{
            title: 'News',
            href: '/news',
          }}
        >
          <div className="grid grid-cols-[40%_60%] gap-2">
            <div className="">
              {posts.map((post) => {
                return <VericalBlogView key={post.slug + 'vertical'} isWithDescription isWithImage blog={post} />;
              })}
            </div>
            <div className="">
              {posts.map((post) => {
                return <HorizontalBlogView key={post.slug + 'horizontal'} blog={post} />;
              })}
            </div>
          </div>
        </NewsDisplayer>
        <div className="">
          <NewsDisplayer
            header={{
              title: 'Hots',
              href: '/hot',
            }}
          >
            {posts.map((post) => {
              return (
                <>
                  <HorizontalBlogView key={post.slug + 'side-horizontal'} blog={post} isWithImage />
                  <Divider />
                </>
              );
            })}
          </NewsDisplayer>
        </div>
      </section>
    </main>
  );
}

export default BlogPage;
