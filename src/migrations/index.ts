import * as migration_20260930_143247_initial from './20260930_143247_initial';

export const migrations = [
  {
    up: migration_20260930_143247_initial.up,
    down: migration_20260930_143247_initial.down,
    name: '20260930_143247_initial'
  },
];
