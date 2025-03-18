"use client";
// import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
// import { useSession } from "next-auth/react";
// import bookmarkProperty from "@/app/actions/bookmarkProperty";
// import checkBookmarkStatus from "@/app/actions/checkBookmarkStatus";
// import { toast } from "react-toastify";
// import { Property } from "@/data/properties";

const BookmarkButton = () => {
  //   const { data: session } = useSession();
  //   const userId = session?.user?.id;

  //   const [isBookmarked, setIsBookmarked] = useState(false);
  //   const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     if (!userId) {
  //       setLoading(false);
  //       return;
  //     }

  //     checkBookmarkStatus(property._id).then((res) => {
  //       if (res.error) toast.error(res.error);
  //       if (res.isBookmarked) setIsBookmarked(res.isBookmarked);
  //       setLoading(false);
  //     });
  //   }, [property._id, userId, checkBookmarkStatus]);

  //   const handleClick = async () => {
  //     if (!userId) {
  //       toast.error("You need to sign in to bookmark a property");
  //       return;
  //     }

  //     bookmarkProperty(property._id).then((res) => {
  //       if (res.error) return toast.error(res.error);
  //       setIsBookmarked(res.isBookmarked);
  //       toast.success(res.message);
  //     });
  //   };

  //   if (loading) return <p className="text-center">Loading...</p>;

  return (
    <button className=" bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center">
      <Bookmark className="mr-2" /> Bookmark Property
    </button>
  );
};
export default BookmarkButton;
