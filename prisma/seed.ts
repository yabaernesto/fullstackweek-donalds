import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

const main = async () => {
  await prismaClient.$transaction(async (tx) => {
    // Deleta todos os restaurantes antes de recriar os dados
    await tx.restaurant.deleteMany();

    // Criando restaurante
    const restaurant = await tx.restaurant.create({
      data: {
        name: "FSW Donalds",
        slug: "fsw-donalds",
        description: "O melhor fast food do mundo",
        avatarImageUrl:
          "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQvcNP9rHlEJu1vCY5kLqzjf29HKaeN78Z6pRy",
        coverImageUrl:
          "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQac8bHYlkBUjlHSKiuseLm2hIFzVY0OtxEPnw",
      },
    });

    // Criando categorias de menu
    const combosCategory = await tx.menuCategory.create({
      data: {
        name: "Combos",
        restaurantId: restaurant.id,
      },
    });

    const hamburguersCategory = await tx.menuCategory.create({
      data: {
        name: "Lanches",
        restaurantId: restaurant.id,
      },
    });

    // Lista de produtos a serem criados
    const products = [
      {
        name: "McOferta Média Big Mac Duplo",
        description:
          "Quatro hambúrgueres (100% carne bovina), alface americana, queijo fatiado sabor cheddar, molho especial, cebola, picles e pão com gergelim, acompanhamento e bebida.",
        price: 39.9,
        imageUrl:
          "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQaHB8tslkBUjlHSKiuseLm2hIFzVY0OtxEPnw",
        menuCategoryId: combosCategory.id,
        restaurantId: restaurant.id,
        ingredients: [
          "Pão com gergelim",
          "Hambúrguer de carne 100% bovina",
          "Alface americana",
          "Queijo fatiado sabor cheddar",
          "Molho especial",
          "Cebola",
          "Picles",
        ],
      },
      {
        name: "Novo Brabo Melt Onion Rings",
        description:
          "Dois hambúrgueres de carne 100% bovina, méquinese, a exclusiva maionese especial com sabor de carne defumada, onion rings, fatias de bacon, queijo processado sabor cheddar, o delicioso molho lácteo com queijo tipo cheddar tudo isso no pão tipo brioche trazendo uma explosão de sabores pros seus dias de glória! Acompanhamento e Bebida.",
        price: 41.5,
        imageUrl:
          "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQeGQofnEPyQaHEV2WL8rGUs41oMICtYfNkphl",
        menuCategoryId: combosCategory.id,
        restaurantId: restaurant.id,
        ingredients: [
          "Pão tipo brioche",
          "Hambúrguer de carne 100% bovina",
          "Méquinese",
          "Maionese especial com sabor de carne defumada",
          "Onion rings",
          "Fatias de bacon",
          "Queijo processado sabor cheddar",
          "Molho lácteo com queijo tipo cheddar",
        ],
      },
    ];

    // Criando produtos um a um devido à limitação do createMany com relacionamentos
    for (const product of products) {
      await tx.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          menuCategoryId: product.menuCategoryId,
          restaurantId: product.restaurantId,
          ingredients: product.ingredients,
        },
      });
    }
  });

  console.log("Seed executado com sucesso!");
};

main()
  .catch((e) => {
    console.error("Erro ao executar seed:", e);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
