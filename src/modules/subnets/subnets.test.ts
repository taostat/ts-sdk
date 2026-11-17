import { HttpClient } from '../../client/http-client';
import { SubnetsModule } from './subnets';
import { V1SubnetHyperparameters, V1SubnetMetrics } from './types';

const pagination = {
  current_page: 1,
  per_page: 2,
  total_items: 2,
  total_pages: 1,
  next_page: null,
  prev_page: null,
};

function metrics(netuid: number): V1SubnetMetrics {
  return {
    block_number: 1000 + netuid,
    timestamp: '2026-11-17T14:00:00.000Z',
    netuid,
    owner: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    owner_hotkey: null,
    registration_block_number: null,
    registration_timestamp: null,
    registration_cost: null,
    active_keys: 1,
    active_validators: 1,
    validators: 1,
    active_dual: 0,
    active_miners: 0,
    neuron_registration_cost: '500000',
    neuron_registrations_this_interval: 0,
    last_adjustment_block: null,
    blocks_until_next_adjustment: 0,
    blocks_since_last_epoch: 0,
    blocks_until_next_epoch: 0,
    tao_from_neuron_registration_24_hours: '0',
    incentive_burn: '0',
    recycled_lifetime: null,
    recycled_since_registration: null,
    excess_tao: null,
    emission: null,
    burn_share: null,
    recycle_share: null,
    owner_share: null,
    miner_share: null,
    validator_share: null,
    validator_root_share: null,
    validator_alpha_share: null,
    gamma_share: null,
    emission_weights_changed_at: null,
    emission_weights_changed_at_block: null,
  };
}

function hyperparameters(netuid: number): V1SubnetHyperparameters {
  return {
    netuid,
    block_number: 2000 + netuid,
    timestamp: '2026-11-17T14:00:12.000Z',
    tempo: 100,
    rho: 10,
    kappa: '0.5',
    immunity_period: 7200,
    activity_cutoff: 5000,
    activity_cutoff_factor_milli: 50000,
    min_allowed_weights: 8,
    max_weights_limit: 65535,
    max_allowed_uids: 64,
    min_allowed_uids: 64,
    max_allowed_validators: 64,
    weights_version: '0',
    weights_rate_limit: '100',
    serving_rate_limit: '50',
    difficulty: '1',
    min_difficulty: '1',
    max_difficulty: '1',
    min_burn: '1000000000',
    max_burn: '100000000000',
    burn_half_life: 360,
    burn_increase_mult: '1.26',
    adjustment_interval: 100,
    adjustment_alpha: '0',
    target_regs_per_interval: 2,
    max_registrations_per_block: 1,
    registration_allowed: true,
    pow_registration_allowed: false,
    bonds_moving_average: '0.9',
    bonds_penalty: '1',
    bonds_reset_enabled: false,
    alpha_low: '0.7',
    alpha_high: '0.9',
    alpha_sigmoid_steepness: 1000,
    liquid_alpha_enabled: false,
    commit_reveal_weights_enabled: true,
    commit_reveal_period: '1',
    scaling_law_power: '0.5',
    yuma_version: 2,
    epoch_consensus: 'Yuma',
    subnet_is_active: true,
    transfers_enabled: true,
    recycle_or_burn: 'Burn',
    root_claim_threshold: '500000',
    collateral_lock_share: '0',
    collateral_drain_ratio: '1',
    owner_immune_neuron_limit: 1,
    mechanism_count: 1,
    mechanism_emission_split: [],
    voting_power_tracking: false,
    voting_power_ema_alpha: '0.00357',
  };
}

describe('SubnetsModule NEW API routes', () => {
  let get: jest.Mock;
  let module: SubnetsModule;

  beforeEach(() => {
    get = jest.fn();
    module = new SubnetsModule({ get } as unknown as HttpClient);
  });

  test('joins metrics and hyperparameters by netuid and retains both snapshot times', async () => {
    get.mockImplementation(async (path: string) => ({
      success: true,
      data: {
        data: path === '/v1/subnets/metrics' ? [metrics(1), metrics(0)] : [hyperparameters(0), hyperparameters(1)],
        pagination,
      },
    }));

    const response = await module.getSubnets({ page: 1, limit: 2 });

    expect(get).toHaveBeenNthCalledWith(1, '/v1/subnets/metrics', { page: 1, limit: 2 });
    expect(get).toHaveBeenNthCalledWith(2, '/v1/subnets/hyperparameters', { page: 1, limit: 2 });
    expect(response.data?.data.map(row => row.netuid)).toEqual([1, 0]);
    expect(response.data?.data[0]).toMatchObject({
      owner: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      block_number: 1001,
      timestamp: '2026-11-17T14:00:00.000Z',
      hyperparameters_block_number: 2001,
      hyperparameters_timestamp: '2026-11-17T14:00:12.000Z',
      tempo: 100,
    });
  });

  test('maps descending order and loads all hyperparameter pages before joining', async () => {
    get.mockImplementation(async (path: string, params: { page?: number }) => {
      if (path === '/v1/subnets/metrics') {
        return { success: true, data: { data: [metrics(128)], pagination } };
      }
      if (params.page === 1) {
        return {
          success: true,
          data: {
            data: [hyperparameters(0)],
            pagination: { ...pagination, next_page: 2 },
          },
        };
      }
      return { success: true, data: { data: [hyperparameters(128)], pagination } };
    });

    const response = await module.getSubnets({ limit: 1, order: 'netuid_desc' });

    expect(get).toHaveBeenNthCalledWith(1, '/v1/subnets/metrics', {
      limit: 1,
      order_by: 'netuid',
      order_dir: 'desc',
    });
    expect(get).toHaveBeenNthCalledWith(2, '/v1/subnets/hyperparameters', { page: 1, limit: 200 });
    expect(get).toHaveBeenNthCalledWith(3, '/v1/subnets/hyperparameters', { page: 2, limit: 200 });
    expect(response.data?.data[0]?.netuid).toBe(128);
  });

  test('uses the v1 owners route and translates the legacy order value', async () => {
    get.mockResolvedValue({ success: true, data: { data: [], pagination } });

    await module.getSubnetOwner({ netuid: 1, order: 'timestamp_desc', startDate: 'ignored' });

    expect(get).toHaveBeenCalledWith('/v1/subnets/owners', {
      netuid: 1,
      order_by: 'timestamp',
      order_dir: 'desc',
    });
  });

  test('fails visibly when the two subnet routes cannot be joined', async () => {
    get.mockImplementation(async (path: string) => ({
      success: true,
      data: { data: path === '/v1/subnets/metrics' ? [metrics(1)] : [], pagination },
    }));

    await expect(module.getSubnets()).rejects.toThrow('no hyperparameters for subnet 1');
  });
});
