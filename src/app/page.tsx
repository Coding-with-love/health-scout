"use client";
import React from 'react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { debounce } from '@/lib/utils'; // Adjust the path as per your project structure
import { JSX, SVGProps} from "react"
import { useState } from 'react';
interface ProductData {
  product: {
    text: string;
  };
  status: number;
  status_verbose: string;
}

const Component: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [productData, setProductData] = useState<ProductData | null>(null);

  const fetchProductData = async (barcode: string): Promise<void> => {
    try {
      const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
      const data: ProductData = await response.json();
      setProductData(data); // Store fetched data in state
    } catch (error) {
      console.error('Fetching error:', error);
    }
  };

  const handleSearch = (): void => {
    if (inputValue && /^\d+$/.test(inputValue)) { // Check if input is numeric
      fetchProductData(inputValue);
    } else {
      console.error("Invalid barcode input");
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-900 py-4 sm:py-6 md:py-8">
        <div className="container flex items-center justify-between px-4 md:px-6">
        <Link className="flex items-center space-x-2 text-gray-50" href="#">
            <ShoppingBagIcon className="w-8 h-8" />
            <span className="font-semibold tracking-wide">Price Scout</span>
          </Link>
          <div className="relative">
            <Input
              aria-owns="search-results"
              className="w-[300px] sm:w-[400px] lg:w-[500px] xl:w-[600px]"
              placeholder="Search for products"
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="#" className="font-medium text-gray-50 hover:underline dark:text-gray-400 dark:hover:underline">Sign in</Link>
            <Link href="#" className="font-medium text-gray-50 hover:underline dark:text-gray-400 dark:hover:underline">Sign up</Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 md:px-6 py-12 lg:py-24">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Find out if a product is good for you
            </h1>
            <p className="max-w-[600px] text-gray-500 dark:text-gray-400">
              Search for a product by its barcode to get detailed information about it. 
            </p>
            {productData && (
              <div className="text-left">
                <h2 className="text-lg font-bold">Product Data:</h2>
                <pre>{JSON.stringify(productData, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 md:py-24">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">© 2024 Product Scout. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <Link href="#" className="rounded-full border p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50">
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="w-4 h-4" />
            </Link>
            <Link href="#" className="rounded-full border p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50">
              <span className="sr-only">GitHub</span>
              <GithubIcon className="w-4 h-4" />
            </Link>
            <Link href="#" className="rounded-full border p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50">
              <span className="sr-only">LinkedIn</span>
              <LinkedinIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
  
}
function GithubIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}


function LinkedinIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}


function ShoppingBagIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}


function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )}
export default Component;
