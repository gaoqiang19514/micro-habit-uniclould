import { accountStorage } from '@/util';
import db from './db';

const recordTable = db.collection('record');

export const add = ({ date, name, time, target }) => {
  const username = accountStorage.get();

  const data = {
    value: time,
    date,
    name,
    target,
    username,
  };

  recordTable.add(data);
};

export const totalValue = async () => {
  const username = accountStorage.get();

  const res = await recordTable
    .where({
      username,
    })
    .get();

  return res.result.data.reduce((acc, curr) => acc + curr.value, 0);
};

export const update = (query, payload) => {
  const username = accountStorage.get();

  return recordTable
    .where({
      username,
      ...query,
    })
    .update(payload);
};

export const get = (query) => {
  const username = accountStorage.get();

  return recordTable
    .where({
      username,
      ...query,
    })
    .get();
};
