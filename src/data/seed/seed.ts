import { envs } from "../../config"
import { CategoryModel, UserModel, ProductModel } from "../mongo";
import { MongoDatabase } from "../mongo/mongo-database"
import { seedData } from "./data";

(async() => {
    MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    })

    await main();


    await MongoDatabase.disconnect()
})();

const randomBetween0andX = ( x: number) => Math.floor(Math.random() * x);

async function main() {
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany()
    ])

    const users = await UserModel.insertMany(seedData.users);
    const categories = await CategoryModel.insertMany(seedData.categories.map(cate => {
        return {
            ...cate,
            user: users[randomBetween0andX(users.length - 1)]._id
        }
    }));

    const product = await ProductModel.insertMany(seedData.products.map(product => {
        return {
            ...product,
            user: users[randomBetween0andX(seedData.users.length - 1)]._id,
            category: categories[randomBetween0andX(seedData.categories.length - 1)]._id
        }
    }))

    console.log("Seeded")
}