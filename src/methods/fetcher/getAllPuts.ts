import { Putt } from "@/data/entities/putt";
import DataSource from "@/data/sources/DataSource";

export default function getAllPutts() {
    const connection = DataSource
    return connection.manager.find(Putt)
}