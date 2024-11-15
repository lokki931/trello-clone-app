import { SideBar } from '../_components/side-bar';

export default function LayoutPlatform({ children }: { children: React.ReactNode }) {
  return (
    <main className="px-4 max-w-screen-2xl mx-auto grid sm:grid-cols-[20%_1fr] gap-5">
      <SideBar />
      <div>{children}</div>
    </main>
  );
}
