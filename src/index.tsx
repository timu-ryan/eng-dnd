import { createRoot } from "react-dom/client";
import { App } from "@/components/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LazyAbout } from "@/pages/about/About.lazy";
import { Shop } from "@/pages/shop";
import { Suspense } from "react";
import {Home} from "@/pages/home/Home";
import {Dnd} from "@/pages/dnd";
import './index.module.scss'

const root = document.getElementById('root');

if (!root) {
  throw new Error('root not found');
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, Component: Home },
      {
        path: '/about',
        element: <Suspense fallback={'Loading...'}><LazyAbout /></Suspense>
      },
      {
        path: '/shop',
        element: <Suspense fallback={'Loading...'}><Shop /></Suspense>
      },
      {
        path: '/dnd',
        element: <Suspense fallback={'Loading...'}><Dnd /></Suspense>
      },
    ]
  }
])

const container = createRoot(root);

container.render(
  <RouterProvider router={router}/>
)

