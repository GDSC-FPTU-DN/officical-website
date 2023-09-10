import GoBackButton from '@components/go-back';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};
function LoginFailed({ searchParams }: Props) {
  const error = searchParams?.error;
  return (
    <div className="container flex justify-center items-center relative flex-col mx-auto h-[80vh]">
      <GoBackButton className="fixed top-4 left-4" />
      <h1 className="text-3xl font-bold">Login Failed</h1>
      <code className="max-w-screen-md font-mono mt-12 bg-foreground-500 text-background mx-auto px-4 py-5 rounded-md">
        Error: {error}
      </code>
    </div>
  );
}

export default LoginFailed;
