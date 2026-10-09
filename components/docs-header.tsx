'use client';

import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import Link from 'fumadocs-core/link';
import { usePathname } from 'fumadocs-core/framework';
import { Sidebar as SidebarIcon } from 'lucide-react';
import { useNotebookLayout } from 'fumadocs-ui/layouts/notebook';
import { isLayoutTabActive } from 'fumadocs-ui/layouts/shared';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@/lib/cn';

/**
 * Top navbar for the docs (AccountWise-style):
 *   [ section tabs ]                      [ theme switch ] [ search ]
 *
 * Each tab is a top-level section folder (meta.json with "root": true).
 * Selecting a tab switches the left sidebar to that section's pages.
 * Below the `lg` breakpoint the tabs are hidden and the sidebar shows
 * the built-in section dropdown instead.
 */
export function DocsHeader(props: ComponentProps<'header'>) {
  const {
    slots,
    navItems,
    isNavTransparent,
    props: { tabs, sidebar },
  } = useNotebookLayout();
  const { open } = slots.sidebar?.useSidebar?.() ?? {};
  const pathname = usePathname();
  const collapsible = sidebar.collapsible ?? true;

  const selectedIdx = useMemo(
    () => tabs.findLastIndex((tab) => isLayoutTabActive(tab, pathname)),
    [tabs, pathname],
  );

  const iconItems = navItems.filter((item) => item.type === 'icon');

  return (
    <header
      id="nd-subnav"
      data-transparent={isNavTransparent && !open}
      {...props}
      className={cn(
        'sticky [grid-area:header] top-(--fd-docs-row-1) z-10 backdrop-blur-sm transition-colors data-[transparent=false]:bg-fd-background/80',
        props.className,
      )}
    >
      <div className="flex h-14 items-center gap-4 border-b px-4 md:px-6">
        {/* Shown on mobile, or on desktop when the sidebar is collapsed */}
        <div className="hidden items-center gap-2 has-data-[collapsed=true]:md:flex max-md:flex">
          {collapsible && slots.sidebar && (
            <slots.sidebar.collapseTrigger
              className={cn(
                buttonVariants({ color: 'ghost', size: 'icon-sm' }),
                '-ms-1.5 text-fd-muted-foreground data-[collapsed=false]:hidden max-md:hidden',
              )}
            >
              <SidebarIcon />
            </slots.sidebar.collapseTrigger>
          )}
          {slots.navTitle && (
            <slots.navTitle className="inline-flex items-center gap-2.5 font-semibold md:hidden" />
          )}
        </div>

        {/* Section tabs */}
        <nav className="flex h-full min-w-0 items-center gap-7 overflow-x-auto max-lg:hidden">
          {tabs.map((tab, i) => {
            const selected = i === selectedIdx;
            if (tab.unlisted && !selected) return null;
            return (
              <Link
                key={tab.url}
                href={tab.url}
                aria-current={selected ? 'page' : undefined}
                className={cn(
                  'inline-flex h-full items-center border-b-2 border-transparent text-[0.9375rem] text-nowrap text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground',
                  selected && 'border-fd-primary font-medium text-fd-primary',
                )}
              >
                {tab.title}
              </Link>
            );
          })}
        </nav>

        {/* Right side: theme switch + search (desktop) */}
        <div className="ms-auto flex items-center gap-3 max-md:hidden">
          {iconItems.map((item, i) =>
            'url' in item ? (
              <Link
                key={i}
                href={item.url}
                aria-label={item.label}
                className={cn(
                  buttonVariants({ color: 'ghost', size: 'icon-sm' }),
                  'text-fd-muted-foreground max-lg:hidden',
                )}
              >
                {item.icon}
              </Link>
            ) : null,
          )}
          {slots.themeSwitch && <slots.themeSwitch />}
          {slots.searchTrigger && (
            <slots.searchTrigger.full hideIfDisabled className="w-64 rounded-lg" />
          )}
        </div>

        {/* Mobile: search icon + sidebar drawer */}
        <div className="ms-auto flex items-center md:hidden">
          {slots.searchTrigger && <slots.searchTrigger.sm hideIfDisabled className="p-2" />}
          {slots.sidebar && (
            <slots.sidebar.trigger
              className={cn(buttonVariants({ color: 'ghost', size: 'icon-sm' }), 'p-2 -me-1.5')}
            >
              <SidebarIcon />
            </slots.sidebar.trigger>
          )}
        </div>
      </div>
    </header>
  );
}
