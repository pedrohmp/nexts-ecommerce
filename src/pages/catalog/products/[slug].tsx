import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Prismic from "prismic-javascript";
import PrismicDOM from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";
import { client } from "@/lib/prismic";
import { GetStaticPaths, GetStaticProps } from "next";

interface ProductProps {
  product: Document;
}

//lazy loading
const AddtoCartModal = dynamic(() => import("@/components/AddToCartModal"), {
  loading: () => <p>Carregando...</p>,
  ssr: false,
});

const products: React.FC<ProductProps> = ({ product }: ProductProps) => {
  const router = useRouter();
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  const handleAddToCart = () => {
    setIsAddToCartModalVisible(true);
  };

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>{PrismicDOM.RichText.asText(product.data.title)}</h1>

      <img src={product.data.thumbnail.url} alt="" width="260" />

      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDOM.RichText.asHtml(product.data.description),
        }}
      />

      <p>Price: ${product.data.price}</p>

      <button onClick={handleAddToCart}>Add to cart</button>

      {isAddToCartModalVisible && <AddtoCartModal />}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;

  const product = await client().getByUID("product", String(slug), {});

  return { props: { product }, revalidate: 10 };
};

export default products;
