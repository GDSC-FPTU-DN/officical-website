import { mainNav } from '@/configs/siteconfig';
import { Icons } from '@components/icons';
import MainNavbar from '@components/navbar';
import { absoluteUrl, generateOgImage } from '@lib/helper';
import { Button } from '@nextui-org/button';
import { Card, CardFooter } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Image } from '@nextui-org/image';
import { Input } from '@nextui-org/input';
import { Tooltip } from '@nextui-org/tooltip';
import { Post } from '@prisma/client';
import { Metadata } from 'next';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
type Props = {
  // searchParams: { [key: string]: string | string[] | undefined };
};

async function getMyPosts() {
  const res = await fetch(absoluteUrl(`/api/blog`), {
    cache: 'no-cache',
  }).then(async (res) => {
    const data = await res.json();
    return data.data as (Post & { author: { name: string; email: string } })[];
  });

  return res;
}

export const metadata: Metadata = {
  title: 'My blogs',
};
async function ProfileBlogs({}: Props) {
  const blogs = await getMyPosts();
  return (
    <div className="">
      <MainNavbar items={mainNav} />
      <main className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-bold">My blogs</h3>
          <div className="flex gap-2 items-center">
            <Button color="success" variant="solid" className="text-success-50" as={Link} href={'/editor'} isIconOnly>
              <Icons.plus className="w-5 h-5" />
            </Button>
            <Divider orientation="vertical" className="h-5" />
            <Input
              placeholder="Search"
              startContent={<Icons.search className="w-5 h-5 text-stone-500" />}
              variant="faded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {blogs?.map((blog) => {
            return (
              <Card key={blog.id} className="w-full" shadow="sm" isFooterBlurred>
                <Image
                  src={blog.ogImage || generateOgImage(blog.title)}
                  alt={blog.title}
                  className="aspect-video object-cover"
                />
                <CardFooter className="absolute border-1 bottom-1 z-10 ml-1 shadow-sm border-white/20 bg-white/20 rounded-full  w-[calc(100%_-_8px)] backdrop-blur-sm">
                  <Link href={`/blog/${blog.slug}`}>
                    <Button color="primary" isIconOnly variant="light">
                      <Icons.eye className="w-5 h-5 cursor-pointer" />
                    </Button>
                  </Link>
                  <Link href={`/blog/${blog.slug}/edit`}>
                    <Button color="secondary" isIconOnly variant="light">
                      <Icons.pen className="w-5 h-5 cursor-pointer" />
                    </Button>
                  </Link>
                  <Tooltip placement="top" content={<p className="text-xs text-stone-500">{blog.title}</p>}>
                    <h3 className="text-base line-clamp-1 font-medium text-white cursor-pointer">{blog.title}</h3>
                  </Tooltip>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default ProfileBlogs;
