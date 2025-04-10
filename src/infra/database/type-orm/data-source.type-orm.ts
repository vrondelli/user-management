import { DataSource } from 'typeorm';
import typeOrmConfig from './type-orm.config';

export const AppDataSource = new DataSource(typeOrmConfig);
