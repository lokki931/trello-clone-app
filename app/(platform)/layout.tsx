import { NavbarPlatform } from './_components/navbar-platform';
export default function LayoutPlatform({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-300 h-full">
      <NavbarPlatform />
      <>{children}</>
    </div>
  );
}
