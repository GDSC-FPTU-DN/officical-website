'use client';

import {
  DEFAULT_SAVE_OPTION,
  SAVE_OPTIONS_KEYS,
  SAVE_OPTION_DESCRIPTIONS,
  SAVE_OPTION_LABELS,
  SaveOption,
} from '@components/editor/editor.contraints';
import EditorJs from '@editorjs/editorjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Divider, Textarea } from '@nextui-org/react';
import { Post } from '@prisma/client';
import '@styles/editor.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '../../hooks/useToast';
import { removeBreakAndTrim } from '../../lib/helper';
import SavePostButton from '../save-post-button';

interface EditorProps {
  post: Pick<Post, 'id' | 'title' | 'content' | 'authorId' | 'published' | 'slug'> & {
    createdAt?: Date;
    updatedAt?: Date;
  };
}
const formSchema = z.object({
  title: z
    .string()
    .nonempty()
    .trim()
    .min(1)
    .max(255)
    .refine((value) => !/\.\s*\n/.test(value), {
      message: 'Text cannot contain a line break within a sentence',
    }),
  content: z.any().optional(),
});
type FormData = z.infer<typeof formSchema>;

function Editor({ post }: EditorProps) {
  console.log('post', post);
  const { register, handleSubmit, formState, control } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
    },
  });
  const editorRef = useRef<EditorJs>();
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setMounted] = useState(false);

  const body = useMemo(() => formSchema.parse(post), [post]);

  const initEditor = useCallback(async () => {
    // const Editorjs = (await import('@editorjs/editorjs')).default;
    //@ts-ignore
    const Header = (await import('@editorjs/header')).default;
    //@ts-ignore
    const Embed = (await import('@editorjs/embed')).default;
    //@ts-ignore
    const Table = (await import('@editorjs/table')).default;
    //@ts-ignore
    const List = (await import('@editorjs/list')).default;
    //@ts-ignore
    const Code = (await import('@editorjs/code')).default;
    //@ts-ignore
    const LinkTool = (await import('@editorjs/link')).default;
    //@ts-ignore
    const InlineCode = (await import('@editorjs/inline-code')).default;
    //@ts-ignore
    const ImageJs = (await import('@editorjs/image')).default;
    // @ts-ignore
    const Paragraph = (await import('@editorjs/paragraph')).default;

    if (!editorRef.current) {
      const editor = new EditorJs({
        holder: 'editor',
        onReady: () => {
          setMounted(true);
          editorRef.current = editor;
        },
        placeholder: 'Write your post here...',
        inlineToolbar: true,
        data: body.content,
        tools: {
          Header: {
            class: Header,
            config: {
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          Paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          Table: {
            class: Table,
            inlineToolbar: true,
          },
          Embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true,
              },
            },
          },
          List: {
            class: List,
            inlineToolbar: true,
          },
          Code: {
            class: Code,
            config: {
              highlight: true,
            },
            inlineToolbar: true,
          },
          LinkTool,
          InlineCode,
          Image: {
            class: ImageJs,
            config: {
              endpoints: {
                byFile: 'http://localhost:3000/editor/image_upload',
                byUrl: 'http://localhost:3000/editor/image_fetch',
              },
            },
          },
        },
      });
    }
  }, [body.content]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      initEditor();

      return () => {
        editorRef.current?.destroy();
        editorRef.current = undefined;
      };
    }
  }, [initEditor, isMounted]);

  const onSubmit = async (data: FormData, mode: SaveOption) => {
    setIsSaving(true);
    console.log('Mode is ', mode);
    if (mode === 'discard') {
      editorRef.current?.clear();
      if (body.content) {
        editorRef.current?.render(body.content);
      }

      setIsSaving(false);
      return;
    }
    const content = await editorRef.current?.save();
    const title = removeBreakAndTrim(data.title);

    const _body = {
      title,
      content,
      mode,
    };

    fetch(`/api/blog/${post.slug}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(_body),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Save failed');
        toast({
          title: 'Save successful',
          description: 'Your post has been saved',
          variant: 'success',
        });
      })
      .catch((err) => {
        toast({
          title: 'Save failed',
          description: err.message,
          variant: 'danger',
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  if (!isMounted) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="prose prose-stone mx-auto">
        <Textarea
          defaultValue={post.title}
          placeholder="Enter a title for your post"
          className="mb-4 max-w-screen-sm overflow-hidden"
          minRows={1}
          variant="underlined"
          classNames={{
            input: 'text-2xl font-bold h-fit lg:text-2xl',
          }}
          validationState={formState.errors.title ? 'invalid' : 'valid'}
          errorMessage={formState.errors.title?.message}
          {...register('title')}
        />
        <div id="editor" {...register('content')} />
        <Divider className="my-4" />
        <div className="flex justify-between gap-3 items-center">
          <SavePostButton
            color="primary"
            options={SAVE_OPTIONS_KEYS}
            labelMap={SAVE_OPTION_LABELS}
            descriptionMap={SAVE_OPTION_DESCRIPTIONS}
            defaultOption={DEFAULT_SAVE_OPTION}
            isLoading={isSaving}
            onClick={(o) => {
              const option: SaveOption = o as SaveOption;
              onSubmit(body, option);
            }}
          />
        </div>
      </div>
    </form>
  );
}

export default Editor;
