import EditProductForm from "@/components/EditProductForm";
import { getPropertyById } from "@/lib/actions/property.actions";

const EditPropertyPage = async ({ params }: { params: { id: string } }) => {
  const property = await getPropertyById(params.id);

  if (!property) {
    return (
      <h1 className='text-center text-2xl font-bold mt-10'>
        Property Not Found
      </h1>
    );
  }

   return (
     <section className="bg-blue-50">
       <div className="container m-auto max-w-2xl py-24">
         <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
           <EditProductForm property={property} />
         </div>
       </div>
     </section>
   );
  };

export default EditPropertyPage;
