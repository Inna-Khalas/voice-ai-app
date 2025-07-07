import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen bg-black/20 backdrop-blur-sm">
      <SignIn />
    </div>
  );
}
