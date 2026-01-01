/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="flex-1 transition-all duration-300 sidebar-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;

