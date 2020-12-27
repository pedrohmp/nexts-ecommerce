import Link from "next/link";
import { Title } from "@/styles/pages/Home";
import { GetServerSideProps } from "next";
import SEO from "@/components/SEO";
import Prismic from "prismic-javascript";
import { Document } from "prismic-javascript/types/documents";
import PrismicDOM from "prismic-dom";
import { client } from "@/lib/prismic";

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {
  // const handleSum = async () => {
  //   //carrega so qnd clicar
  //   const math = (await import("@/lib/math")).default;

  //   alert(math.sum(3, 4));
  // };

  return (
    <div>
      <SEO
        title="DevCommerce, your best e-commerce!"
        shouldExcludeTitleSuffix
        image="boost.png"
      />
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map((recommendedProducts) => {
            return (
              <li key={recommendedProducts.id}>
                <Link href={`/catalog/products/${recommendedProducts.uid}`}>
                  <a>
                    {PrismicDOM.RichText.asText(recommendedProducts.data.title)}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* <button onClick={() => handleSum()}>Sum!</button> */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at("document.type", "product"),
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    },
  };
};
