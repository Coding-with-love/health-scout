"use client";
import dynamic from "next/dynamic";
import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { debounce } from "@/lib/utils"; // Adjust the path as per your project structure
import { JSX, SVGProps } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import BarcodeScanner from "../../components/barcodeScanner/scanner";

interface ProductData {
  product: {
    product_name?: string;
    code?: string;
    quantity?: string;
    image_url?: string;
    brands?: string;
    brand_owner?: string;
    packaging?: string;
    categories?: string;
    countries?: string;
    nutriscore_grade?: string; // assuming this is part of the data
    nova_group?: number; // assuming this is part of the data
    ecoscore_grade?: string; // assuming this is part of the data
    ingredients_text?: string;
    image_ingredients_url?: string;
    additives_tags?: string[];
    nutriscore_score?: number;
    image_nutrition_url?: string;
    compared_to_category?: string;
    energy_100g: number;
    energy_serving: number;
    energy_unit: string;
    nutriscore_data: {
      positive_points?: number;
      proteins_points?: number;
      fiber_points?: number;
      fruits_vegetables_nuts_colza_walnut_olive_oils_points?: number;
      negative_points?: number;
      energy_points?: number;
      sugars_points?: number;
      saturated_fat_points?: number;
      sodium_points?: number;
    };
    nutriments: {
      fat: number;
      saturated_fat: number;
      sugars: number;
      salt: number;
    };

    // assuming this is part of the data
  };
  // ... additional data from the API response
}

const PreferencesSection = ({
  nutriScore,
  novaScore,
  ecoScore,
}: {
  nutriScore?: string;
  novaScore?: string | number;
  ecoScore?: string;
}) => {
  // If a score is not provided (undefined), it defaults to 'N/A'
  const nutriDetails = nutriScoreDetails(nutriScore ?? 'N/A');
  const novaDetails = noveScoreDetails(novaScore ?? 'N/A');
  const ecoDetails = ecoScoreDetails(ecoScore ?? 'N/A');
  ecoScore = ecoScore?.toUpperCase() ?? 'N/A';
  nutriScore = nutriScore?.toUpperCase() ?? "N/A";
  novaScore = novaScore?.toString() ?? "N/A";

  return (
    <div className="my-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Matching with your preferences</h2>
      <div className="flex flex-wrap gap-4">
     <div className="flex items-center gap-2">
          <div
            className={`p-2 text-white rounded-full ${nutriScoreColor(
              nutriScore
            )}`}
          >
            Nutri-Score {nutriScore}
          </div>
          <p>{nutriDetails.message}</p>
          </div>
        <div className="flex items-center gap-2">
          <div className={`p-2 text-white rounded-full ${novaDetails.className}`}>
            NOVA {novaScore}
          </div>
          <p>{novaDetails.message}</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`p-2 text-white rounded-full ${ecoScoreDetails(
              ecoScore
            ).className}`}
          >
            Eco-Score {ecoScore}
          </div>
          <p>{ecoScoreDetails(ecoScore).message}</p>
        </div>
      </div>
    </div>
  );
};


const nutriScoreColor = (score: string) => {
  switch (score) {
    case "A":
      return "bg-green-500";
    case "B":
      return "bg-green-400";
    case "C":
      return "bg-yellow-400";
    case "D":
      return "bg-orange-500";
    case "E":
      return "bg-red-600";
    default:
      return "bg-gray-300";
  }
};
const nutriScoreDetails = (score: string | undefined) => {
  // Ensure score is in uppercase
  const upperScore = score ? score.toUpperCase() : '';

  switch (upperScore) {
      case 'A':
          return { className: 'bg-green-500', message: 'Very good nutritional quality' };
      case 'B':
          return { className: 'bg-green-400', message: 'Good nutritional quality' };
      case 'C':
          return { className: 'bg-yellow-400', message: 'Average nutritional quality' };
      case 'D':
          return { className: 'bg-orange-500', message: 'Poor nutritional quality' };
      case 'E':
          return { className: 'bg-red-600', message: 'Bad nutritional quality' };
      default:
          return { className: 'bg-gray-300', message: 'N/A' };
  }
};

const noveScoreDetails = (score: string | number | undefined) => {
  switch (score) {
    case 1:
      return { className: 'bg-green-500', message: 'Unprocessed or minimally processed foods' };
    case 2:
      return { className: 'bg-green-300', message: 'Processed culinary ingredients' };
    case 3:
      return { className: 'bg-yellow-500', message: 'Processed foods' };
    case 4:
      return { className: 'bg-red-600', message: 'Ultra processed foods' };
    default:
      return { className: 'bg-gray-300', message: 'N/A' };
  }
};
const ecoScoreDetails = (score: string | undefined) => {
  switch (score) {
    case 'A':
      return { className: 'bg-green-500', message: 'Very low environmental impact' };
    case 'B':
      return { className: 'bg-green-400', message: 'Low environmental impact' };
    case 'C':
      return { className: 'bg-yellow-400', message: 'Moderate environmental impact' };
    case 'D':
      return { className: 'bg-orange-500', message: 'High environmental impact' };
    case 'E':
      return { className: 'bg-red-600', message: 'Very high environmental impact' };
    case 'Not-applicable':
      return { className: 'bg-gray-300', message: 'Not yet applicable for the category' };
    case 'Unknown':
      return { className: 'bg-gray-300', message: 'Unknown environmental impact' };
    default:
      return { className: 'bg-gray-300', message: 'N/A' };
  }
};


const HealthSection = ({
  ingredients,
  ingredientsImage,
  novaScore,
  additives,
  nutriScore,
  positivePoints,
  proteinsPoints,
  fiberPoints,
  fruitsPoints,
  negativePoints,
  energyPoints,
  sugarsPoints,
  saturatedFatPoints,
  sodiumPoints,
  energyGram,
  category,
  energyMainUnit,
  nutriscore,
  nutriImage,
  fatPercentage,
  sugarsPercentage,
  saturatedFatPercentage,
  saltPercentage,
  energyServing,

}: {
  ingredients: string;
  ingredientsImage: string;
  novaScore?: number;
  additives?: string[];
  nutriScore?: string;
  positivePoints?: number;
  proteinsPoints?: number;
  fiberPoints?: number;
  fruitsPoints?: number;
  negativePoints?: number;
  energyPoints?: number;
  sugarsPoints?: number;
  saturatedFatPoints?: number;
  sodiumPoints?: number;
  nutriscore?: number;
  nutriImage?: string;
  fatPercentage?: number;
  sugarsPercentage?: number;
  saturatedFatPercentage?: number;
  saltPercentage?: number;
  energyGram?: number;
  energyServing?: number;
  category?: string;
  energyMainUnit?: string;
}) => {
  ingredients = ingredients ?? "N/A";
  ingredientsImage = ingredientsImage ?? "N/A";
  novaScore = novaScore || undefined;
  additives = additives ?? [];
  nutriScore = nutriScore ?? "N/A";
  positivePoints = positivePoints || undefined;
  proteinsPoints = proteinsPoints || undefined;
  fiberPoints = fiberPoints || undefined;
  fruitsPoints = fruitsPoints || undefined;
  negativePoints = negativePoints || undefined;
  energyPoints = energyPoints || undefined;
  sugarsPoints = sugarsPoints || undefined;
  saturatedFatPoints = saturatedFatPoints || undefined;
  sodiumPoints = sodiumPoints || undefined;
  nutriscore = nutriscore || undefined;
  nutriImage = nutriImage || "N/A";
  fatPercentage = fatPercentage || undefined;
  sugarsPercentage = sugarsPercentage || undefined;
  saturatedFatPercentage = saturatedFatPercentage || undefined;
  saltPercentage = saltPercentage || undefined;
  energyGram = energyGram || undefined;
  energyServing = energyServing || undefined;
  category = category || "N/A";
  energyMainUnit = energyMainUnit || "N/A";

  const nutriDetails = nutriScoreDetails(nutriScore ?? 'N/A');
  nutriScore = nutriScore?.toUpperCase() ?? "N/A";
  return (
    <div>
      <div className="my-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Health</h2>
        <section>
          <h3 style={{ fontSize: "1rem", fontWeight: "bold" }}>Ingredients</h3>
          <p>{ingredients}</p>
          {/* Placeholder image */}
          {ingredientsImage !== "N/A" ? (
            <Image
              src={ingredientsImage}
              alt="Ingredients label"
              width={400}
              height={300}
              layout="responsive"
            />
          ) : (
            <p>No image available</p>
          )}
        </section>
      </div>

      <div className="my-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Food Processing</h2>
        <section>
          <h3 className="font-bold">NOVA Classification</h3>
          <p>
            NOVA classification is a system that categorizes food based on the
            extent and purpose of food processing.
          </p>
          <div
            className={`p-2 ${novaScoreColor(
              novaScore || 0
            )} rounded-full text-white`}
          >

            <h3>NOVA {novaScore}</h3>
            <p>
              {novaScore === 1
                ? "Unprocessed or minimally processed foods"
                : novaScore === 2
                ? "Processed culinary ingredients"
                : novaScore === 3
                ? "Processed foods"
                : novaScore === 4
                ? "Ultra processed foods"
                : "N/A"}
            </p>
          </div>
          {additives.length > 0 ? (
            <div>
              <h3 className="font-bold mt-4">Additives</h3>
              <ul className="list-disc pl-5">
                {additives.map((additive, index) => (
                  <li key={index}>{additive}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No additives information available</p>
          )}
          <p className="mt-4">
            The determination of the group is based on the category of the
            product and on the ingredients it contains.
          </p>
          {/* ... more NOVA classification info here */}
        </section>
      </div>
      <div className="my-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Nutrition</h2>
        <section>
          <h3 className="font-bold">Nutri-Score</h3>
          <p>
            Nutri-Score is a color-coded nutrition label that classifies food
            products according to their nutritional quality.
          </p>
         
          <div
            className={`p-2 text-white rounded-full ${nutriScoreColor(
              nutriScore
            )}`}
          >
            Nutri-Score {nutriScore}
          
          <p>{nutriDetails.message}</p>
          </div>

          <p className="mt-4">Positive Points: {positivePoints}</p>

          <p>Proteins: {proteinsPoints}/5</p>
          <p>Fiber: {fiberPoints}/5</p>
          <p>
            Fruits, vegetables, nuts, and colza/walnut/olive oils:{" "}
            {fruitsPoints}/5
          </p>
          <br></br>
          <p className="mt-4">Negative Points: {negativePoints}</p>

          <p>Energy: {energyPoints}/5</p>
          <p>Sugars: {sugarsPoints}/5</p>
          <p>Saturated Fat: {saturatedFatPoints}/5</p>
          <p>Sodium: {sodiumPoints}/5</p>
          <br></br>
          <p>Nutritional Score: {nutriscore}</p>
          <div className="w-full md:w-48 relative">
            <Image
              src={nutriImage}
              alt="Nutrition Image"
              width={400} // These should be the intrinsic dimensions of the image
              height={300} // Or the aspect ratio that you desire
              layout="responsive" // This makes the image scale nicely to the parent element's width
            />
          </div>
          <br></br>
          <h3>Nutrient Levels</h3>
          <p>Fat in high quantity: {fatPercentage}%</p>
          <p>Saturated fat in high quantity: {fatPercentage}%</p>
          <p>Sugars in high quantity: {sugarsPercentage}%</p>
          <p>Salt in high quantity: {saltPercentage}%</p>
          <br></br>

          {/*<h3>Nutrition Facts</h3>
              <table>
                <tr>
                  <td>Nutrition Facts</td>
                  <td>As sold 
                    for 100 g / 100 ml</td>
                  <td>As sold 
                    per serving (5 crackers (16 g) (16 g))</td>
                  <td>Compared to: {category}</td>
                </tr>
                <tr>
                  <td>Energy</td>
                  <td>{energyGram} {energyUnit}</td>
                  <td>{energyServing}</td>
                  <td></td>
                </tr>
              </table> */}
        </section>
      </div>
    </div>
  );
};

const novaScoreColor = (score: number) => {
  switch (score) {
    case 1:
      return "bg-green-500";
    case 2:
      return "bg-green-300";
    case 3:
      return "bg-yellow-500";
    case 4:
      return "bg-red-600";
    default:
      return "bg-gray-300";
  }
};

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [barcode, setBarcode] = useState("");
  const [isActive, setIsActive] = React.useState(false);

  const handleDetected = async (code: string) => {
    setInputValue(code);  // Update the input field with the detected barcode
    await fetchProductData(code);  // Fetch product data using the barcode
    setIsActive(false);  // Optionally deactivate the scanner after detection
};

const fetchProductData = async (barcode: string): Promise<void> => {
  if (!barcode) return;  // Prevent fetching if the barcode is empty
  try {
      const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
      if (!response.ok) {
          throw new Error("Failed to fetch product data");
      }
      const data = await response.json();
      setProductData(data);  // Update state with the fetched product data
  } catch (error) {
      console.error("Fetching error:", error);
  }
};



  const handleSearch = debounce((value: string): void => {
    if (value && /^\d+$/.test(value)) {
      fetchProductData(value);
    } else {
      console.error("Invalid barcode input");
    }
  }, 400);

  // Example constraints to use the rear-facing camera
  const videoConstraints = {
    facingMode: "environment",
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-900 py-4 sm:py-6 md:py-8">
        <div className="container flex items-center justify-between px-4 md:px-6">
          <Link className="flex items-center space-x-2 text-gray-50" href="#">
            <ShoppingBagIcon className="w-8 h-8" />
            <span className="font-semibold tracking-wide">Product Scout</span>
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
            <Link
              href="#"
              className="font-medium text-gray-50 hover:underline dark:text-gray-400 dark:hover:underline"
            >
              Sign in
            </Link>
            <Link
              href="#"
              className="font-medium text-gray-50 hover:underline dark:text-gray-400 dark:hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="w-full max-w-lg p-4">
          <Input
            aria-label="Search for products"
            className="w-full mb-4"
            placeholder="Enter barcode"
            type="search"
            value={inputValue}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch(inputValue);
              }
            }}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            onClick={() => handleSearch(inputValue)}
            size="sm"
            variant="outline"
          >
            Search
          </Button>
          <div>
          <button onClick={() => setIsActive(!isActive)}>
                        {isActive ? "Stop Scanning" : "Start Scanning"}
                    </button>
                    {isActive && (
                        <BarcodeScanner
                            isActive={isActive}
                            onScanned={handleDetected}
                        />
                    )}
                    <p>Detected Barcode: {barcode || "No barcode detected"}</p>
    </div>
          {productData && (
            <div className="container mx-auto mt-8 p-4">
              <div className="flex flex-col md:flex-row md:items-center bg-white shadow-lg rounded-lg overflow-hidden">
                {productData.product.image_url && (
                  <div className="w-full md:w-48 relative">
                    <Image
                      src={productData.product.image_url}
                      alt="Product Image"
                      width={400} // These should be the intrinsic dimensions of the image
                      height={300} // Or the aspect ratio that you desire
                      layout="responsive" // This makes the image scale nicely to the parent element's width
                    />
                  </div>
                )}
                <div className="p-4">
                  <h1 className="text-2xl font-bold mb-2">
                    {productData.product.product_name || "Product Name"}
                  </h1>
                  <p className="text-gray-700 mb-1">
                    Barcode: {productData.product.code || "Barcode Information"}
                  </p>
                  <p className="text-gray-700 mb-1">
                    Quantity:{" "}
                    {productData.product.quantity || "Quantity Information"}
                  </p>
                  <p className="text-gray-700 mb-1">
                    Brand: {productData.product.brands || "Brand Information"}
                  </p>
                  <p className="text-gray-700 mb-1">
                    Brand Owner:{" "}
                    {productData.product.brand_owner ||
                      "Brand Owner Information"}
                  </p>
                  <p className="text-gray-700 mb-1">
                    Packaging:{" "}
                    {productData.product.packaging || "Packaging Information"}
                  </p>
                  <p className="text-gray-700 mb-1">
                    Categories:{" "}
                    {productData.product.categories || "Category Information"}
                  </p>
                  <p className="text-gray-700 mb-1">
                    Countries where sold:{" "}
                    {productData.product.countries || "Country Information"}
                  </p>
                  {/* ... more product information */}
                </div>
              </div>
            </div>
          )}

          {productData && productData.product && (
            <PreferencesSection
              nutriScore={productData.product.nutriscore_grade}
              novaScore={productData.product.nova_group}
              ecoScore={productData.product.ecoscore_grade}
            />
          )}
          {productData && productData.product && (
            <>
              <HealthSection
                ingredients={productData.product.ingredients_text || "N/A"}
                ingredientsImage={
                  productData.product.image_ingredients_url || "N/A"
                }
                novaScore={productData.product.nova_group}
                additives={productData.product.additives_tags}
                nutriScore={productData.product.nutriscore_grade}
                positivePoints={
                  productData.product.nutriscore_data.positive_points || undefined
                } 
                
                proteinsPoints={
                  productData.product.nutriscore_data.proteins_points
                }
                fiberPoints={productData.product.nutriscore_data.fiber_points}
                fruitsPoints={
                  productData.product.nutriscore_data
                    .fruits_vegetables_nuts_colza_walnut_olive_oils_points
                }
                negativePoints={
                  productData.product.nutriscore_data.negative_points
                }
                energyPoints={productData.product.nutriscore_data.energy_points}
                sugarsPoints={productData.product.nutriscore_data.sugars_points}
                saturatedFatPoints={
                  productData.product.nutriscore_data.saturated_fat_points
                }
                sodiumPoints={productData.product.nutriscore_data.sodium_points}
                nutriscore={productData.product.nutriscore_score}
                nutriImage={productData.product.image_nutrition_url}
                fatPercentage={productData.product.nutriments.fat}
                sugarsPercentage={productData.product.nutriments.sugars}
                saturatedFatPercentage={
                  productData.product.nutriments.saturated_fat
                }
                saltPercentage={productData.product.nutriments.salt}
                category={productData.product.compared_to_category}
                energyGram={productData.product.energy_100g}
                energyServing={productData.product.energy_serving}
                energyMainUnit={productData.product.energy_unit}
              />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 md:py-24">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Product Scout. All rights reserved.
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="#"
              className="rounded-full border p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="rounded-full border p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              <span className="sr-only">GitHub</span>
              <GithubIcon className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="rounded-full border p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              <span className="sr-only">LinkedIn</span>
              <LinkedinIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
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
  );
}

function LinkedinIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
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
  );
}

function ShoppingBagIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
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
  );
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
  );
}
export default Home;
