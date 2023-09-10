import { Icons } from '@components/icons';
import { getSessionServerSide } from '@lib/auth';
import { estimateReadingTimeByContent, generateOgImage } from '@lib/helper';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { Image } from '@nextui-org/image';
import { User as UserDisplay } from '@nextui-org/user';
import { Post, User } from '@prisma/client';
import { format } from 'date-fns';
import Blocks, { DataProp } from 'editorjs-blocks-react-renderer';
import NextImage from 'next/image';
import Link from 'next/link';

type Props = {
  blog: Post & {
    author?: Partial<User>;
  };
};

function toDataProp(content: any): DataProp {
  const b = content as any;
  if (!b)
    return {
      blocks: [],
      version: '',
      time: 0,
    };

  return {
    blocks: b.blocks || [],
    version: b.version || '',
    time: b.time || 0,
  };
}

async function BlogRenderer({ blog }: Props) {
  const user = await getSessionServerSide();
  const data = toDataProp(blog.content);

  return (
    <div className="prose prose-stone mx-auto">
      <h1 className="">{blog.title}</h1>
      <UserDisplay
        name={blog.author?.name}
        avatarProps={{
          src: blog.author?.image || '/images/avatar.png',
          alt: blog.author?.name || 'avatar',
        }}
        description={
          <div className="flex items-center space-x-1">
            <div>
              <span>{blog.published ? 'Published' : 'Draft'} at &nbsp;</span>
              <span>{format(new Date(blog.updatedAt), 'dd/MM/yyyy')}</span>
            </div>
            <Icons.dot className="w-4 h-4" />
            <span>{estimateReadingTimeByContent(blog.content)} min read</span>
          </div>
        }
      />
      <p className="text-stone-500 border-l-2 pl-4">{blog.description}</p>
      <Image
        as={NextImage}
        src={blog.ogImage || generateOgImage(blog.title)}
        alt={blog.title}
        width={1200}
        height={630}
        isBlurred
        classNames={{
          blurredImg: 'offset-2',
        }}
      />
      <Blocks data={data} />
      {blog.author?.email === user?.user.email && (
        <>
          <Divider />
          <Link href={`/blog/${blog.slug}/edit`}>
            <Button color="primary" variant="flat" startContent={<Icons.pen className="w-4 h-4" />}>
              Edit
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

export default BlogRenderer;
