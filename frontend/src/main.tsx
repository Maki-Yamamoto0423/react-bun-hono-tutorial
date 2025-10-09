import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RouterProvider, createRouter } from '@tanstack/react-router';

// ルートツリーをインポート
import { routeTree } from './routeTree.gen';

// QueryClientを作成
const queryClient = new QueryClient();

// ルーターを作成
const router = createRouter({ routeTree });

// TypeScriptの型安全性のための宣言
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
