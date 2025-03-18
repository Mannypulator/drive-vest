import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import PropertyDetails from "@/components/PropertyDetails";
import PropertyImages from "@/components/PropertyImages";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButtons from "@/components/ShareButtons";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PropertyContactForm from "@/components/PropertyContactForm";
import { getPropertyById } from "@/lib/actions/property.actions";
import { Property } from "@/types";

interface PropertyPageProps {
  params: { id: string };
}

const PropertyPage = async ({ params }: PropertyPageProps) => {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }

  // Type assertion to match the expected Property type
  const typedProperty = property as unknown as Property;
  return (
    <>
      <PropertyHeaderImage image={typedProperty?.images?.[0]} />
      <section className="rounded-xl">
        <div className="container m-auto py-6 px-6">
          <Link
            href="/properties"
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <ArrowLeft color="#E6B027" className="mr-2" />{" "}
            <span className="text-[#E6B027]">Back to Properties</span>
          </Link>
        </div>
      </section>
      <section className="bg-blue-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-[70%_30%] lg:grid-cols-[70%_30%] w-full gap-6">
            <PropertyDetails property={typedProperty} />
            <aside className="space-y-4">
              <BookmarkButton />
              <ShareButtons property={typedProperty} />
              <PropertyContactForm property={typedProperty} />
            </aside>
          </div>
        </div>
      </section>
      <PropertyImages images={typedProperty.images} />
    </>
  );
};

export default PropertyPage;
