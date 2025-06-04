import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function main() {
  type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: unknown;
  };

  const { data: products } = await axios.get<Product[]>(
    'https://fakestoreapi.com/products',
  );

  for (const product of products) {
    await prisma.product.create({
      data: {
        title: product.title,
        description: product.description,
        category: product.category,
        price: Number(product.price),
        image: product.image,
        rating: JSON.stringify(product.rating),
      },
    });
  }

  console.log('Produtos populados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().then(() => {});
  });
