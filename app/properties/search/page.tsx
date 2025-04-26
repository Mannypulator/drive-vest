import Link from "next/link";

import { SearchParams } from "next/dist/server/request/search-params";
import { searchProperties } from "@/lib/actions/property.actions";
import PropertyFilters from "@/components/PropertyFilter";
import { ArrowLeft } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import PropertySearchForm from "@/components/PropertySearchForm";
const SearchResultsPage = async (searchParams: SearchParams) => {
  const { location, propertyType, priceMax } = searchParams;
  const properties = await searchProperties({
    location: Array.isArray(location) ? location[0] : location,
    propertyType: Array.isArray(propertyType) ? propertyType[0] : propertyType,
    priceMax: Array.isArray(priceMax) ? priceMax[0] : priceMax,
  });

  return (
    <>
      <section className="bg-[linear-gradient(219.84deg,_var(--text-primary)_4.14%,_var(--text-secondary)_44.22%)] py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <PropertySearchForm />
        </div>
      </section>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <Link
            href="/properties"
            className="flex items-center text-[#E6B027] hover:underline mb-3"
          >
            <ArrowLeft className="mr-2 mb-1" /> Back To Properties
          </Link>
          <h1 className="text-2xl mb-4">Search Results</h1>
          {properties.length === 0 ? (
            <p>No search results found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
export default SearchResultsPage;
