'use client';
import { Icons } from '@components/icons';
import { toast } from '@hooks/useToast';
import { slugtify, toTitleCase } from '@lib/helper';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link, Textarea } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

type Props = {};

function NewPostForm({}: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const slug = useMemo(() => {
    return slugtify(title);
  }, [title]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const _title = title.length > 0 ? toTitleCase(title) : 'Untitled';
    const _description = e.currentTarget.description.value;

    fetch('/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: _title, slug, description: _description }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Create failed', {
            cause: res.status,
          });
        }
        let willNavigate = true;

        toast({
          variant: 'success',
          title: 'Create successful',
          description: 'Your blog has been created, redirecting to editor...',
          duration: 2500,
          action: (
            <Button
              color={'danger'}
              variant="solid"
              onClick={() => {
                willNavigate = false;
              }}
            >
              Dismiss
            </Button>
          ),
        });

        setTimeout(() => {
          if (willNavigate) {
            route.push(`/blog/${slug}/edit`);
          }
        }, 2000);
      })
      .catch((err) => {
        toast({
          variant: 'danger',
          title: 'Create failed',
          description: err.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <Card className="max-w-sm mx-auto" shadow="sm">
        <CardHeader>
          <section className="py-2 px-3">
            <h3 className="text-xl font-bold">Create new blog</h3>
            <p className="text-sm text-stone-400 mt-1">
              Before you start, please make sure you have read our{' '}
              <Link href={'/docs'} className="text-sm">
                documentation
              </Link>{' '}
              and our{' '}
              <Link href={'/terms'} className="text-sm">
                terms of service
              </Link>
              .
            </p>
          </section>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter a title for your blog"
            description={`The url will be: ${slug}`}
            disabled={isLoading}
            size="sm"
            required
            value={title}
            isRequired
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            value={description}
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            label="Blog description"
            placeholder='Overall content of the blog. e.g. "This is a blog about..."'
            disabled={isLoading}
            description="This will be used for preview content"
            maxLength={255}
            size="sm"
          />
        </CardBody>
        <Divider />
        <CardFooter className="flex gap-unit-sm justify-end">
          <Button color={'primary'} startContent={<Icons.add />} type={'submit'} isLoading={isLoading}>
            Create
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default NewPostForm;
