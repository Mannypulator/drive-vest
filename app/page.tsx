import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderOutline from "@/components/HeaderOutline";
import Hero from "@/components/Hero";
import NavTabs from "@/components/NavTabs";
import PropertyFilters from "@/components/PropertyFilter";
import PropertyListings from "@/components/PropertyListings";

export default function Home() {
  return (
    <>
      <Header />
      <HeaderOutline />
      <Hero />
      <PropertyFilters />
      <NavTabs />
      <PropertyListings />
      <PropertyListings />
      <PropertyListings />
      <Footer />
    </>
  );
}
