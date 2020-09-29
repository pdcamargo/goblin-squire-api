import { Table, IGameTable, IUser } from './service';
import RedisService from '../redis';

export default new Table(RedisService);

export { IGameTable, IUser };
