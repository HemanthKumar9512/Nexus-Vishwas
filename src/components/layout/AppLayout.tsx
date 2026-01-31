import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setSidebarWidth(0);
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSidebarWidth(entry.contentRect.width);
      }
    });

    const sidebar = document.querySelector('aside');
    if (sidebar) {
      observer.observe(sidebar);
    }

    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background">
      {!isMobile && <Sidebar />}
      <div
        className={cn('transition-all duration-300')}
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <Header />
        <main className={cn('p-4 md:p-6', isMobile && 'pb-20')}>
          {children}
        </main>
      </div>
    </div>
  );
}
