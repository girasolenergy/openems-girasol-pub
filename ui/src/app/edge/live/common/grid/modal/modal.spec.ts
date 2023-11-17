import {
  CHANNEL_LINE,
  DummyConfig,
  LINE_HORIZONTAL,
  LINE_INFO_PHASES_DE,
  PHASE_ADMIN,
  PHASE_GUEST,
  SOCOMEC_GRID_METER,
} from 'src/app/shared/edge/edgeconfig.spec';
import { TestContext, sharedSetup } from 'src/app/shared/test/utils.spec';

import { GridMode } from 'src/app/shared/shared';
import { OeFormlyViewTester } from 'src/app/shared/genericComponents/shared/testing/tester';
import { Role } from 'src/app/shared/type/role';
import { expectView } from './constants.spec';

const VIEW_CONTEXT = (properties?: {}): OeFormlyViewTester.Context => ({
  '_sum/GridMode': GridMode.ON_GRID,
  '_sum/GridActivePower': -1000,
  'meter0/ActivePower': -1000,
  'meter0/VoltageL1': 230000,
  'meter0/CurrentL1': 2170,
  'meter0/ActivePowerL1': -500,
  'meter0/ActivePowerL2': 1500,
  ...properties,
});

describe('Grid - Modal', () => {
  let TEST_CONTEXT: TestContext;
  beforeEach(() => (TEST_CONTEXT = sharedSetup()));

  it('generateView()', () => {
    {
      // No Meters
      const EMS = DummyConfig.from();

      expectView(EMS, Role.ADMIN, VIEW_CONTEXT(), TEST_CONTEXT, {
        title: 'グリッド',
        lines: [],
      });
    }

    {
      // Single Meter
      const EMS = DummyConfig.from(SOCOMEC_GRID_METER('meter0', 'Netzzähler'));

      // Admin and Installer
      expectView(EMS, Role.ADMIN, VIEW_CONTEXT(), TEST_CONTEXT, {
        title: 'グリッド',
        lines: [
          CHANNEL_LINE('買電', '0 W'),
          CHANNEL_LINE('売電', '1.000 W'),
          PHASE_ADMIN('フェーズ L1 売電', '230 V', '2,2 A', '500 W'),
          PHASE_ADMIN('フェーズ L2 買電', '-', '-', '1.500 W'),
          PHASE_ADMIN('フェーズ L3', '-', '-', '-'),
          LINE_HORIZONTAL,
          LINE_INFO_PHASES_DE,
        ],
      });

      // Owner and Guest
      expectView(EMS, Role.OWNER, VIEW_CONTEXT(), TEST_CONTEXT, {
        title: 'グリッド',
        lines: [
          CHANNEL_LINE('買電', '0 W'),
          CHANNEL_LINE('売電', '1.000 W'),
          PHASE_GUEST('フェーズ L1 売電', '500 W'),
          PHASE_GUEST('フェーズ L2 買電', '1.500 W'),
          PHASE_GUEST('フェーズ L3', '-'),
          LINE_HORIZONTAL,
          LINE_INFO_PHASES_DE,
        ],
      });

      // Offgrid
      expectView(
        EMS,
        Role.ADMIN,
        VIEW_CONTEXT({ '_sum/GridMode': GridMode.OFF_GRID }),
        TEST_CONTEXT,
        {
          title: 'グリッド',
          lines: [
            {
              type: 'channel-line',
              name: 'グリッド接続なし！',
              value: '',
            },
            CHANNEL_LINE('買電', '0 W'),
            CHANNEL_LINE('売電', '1.000 W'),
            PHASE_ADMIN('フェーズ L1 売電', '230 V', '2,2 A', '500 W'),
            PHASE_ADMIN('フェーズ L2 買電', '-', '-', '1.500 W'),
            PHASE_ADMIN('フェーズ L3', '-', '-', '-'),
            LINE_HORIZONTAL,
            LINE_INFO_PHASES_DE,
          ],
        }
      );
    }

    {
      // Two Meters
      const EMS = DummyConfig.from(
        SOCOMEC_GRID_METER('meter10'),
        SOCOMEC_GRID_METER('meter11')
      );

      // Admin and Installer -> two meters
      expectView(EMS, Role.ADMIN, VIEW_CONTEXT(), TEST_CONTEXT, {
        title: 'グリッド',
        lines: [
          CHANNEL_LINE('買電', '0 W'),
          CHANNEL_LINE('売電', '1.000 W'),
          LINE_HORIZONTAL,
          CHANNEL_LINE('meter10', '-'),
          PHASE_ADMIN('フェーズ L1', '-', '-', '-'),
          PHASE_ADMIN('フェーズ L2', '-', '-', '-'),
          PHASE_ADMIN('フェーズ L3', '-', '-', '-'),
          LINE_HORIZONTAL,
          CHANNEL_LINE('meter11', '-'),
          PHASE_ADMIN('フェーズ L1', '-', '-', '-'),
          PHASE_ADMIN('フェーズ L2', '-', '-', '-'),
          PHASE_ADMIN('フェーズ L3', '-', '-', '-'),
          LINE_HORIZONTAL,
          LINE_INFO_PHASES_DE,
        ],
      });

      // Owner and Guest -> two meters
      expectView(EMS, Role.GUEST, VIEW_CONTEXT(), TEST_CONTEXT, {
        title: 'グリッド',
        lines: [
          CHANNEL_LINE('買電', '0 W'),
          CHANNEL_LINE('売電', '1.000 W'),
          LINE_HORIZONTAL,
          CHANNEL_LINE('meter10', '-'),
          PHASE_GUEST('フェーズ L1', '-'),
          PHASE_GUEST('フェーズ L2', '-'),
          PHASE_GUEST('フェーズ L3', '-'),
          LINE_HORIZONTAL,
          CHANNEL_LINE('meter11', '-'),
          PHASE_GUEST('フェーズ L1', '-'),
          PHASE_GUEST('フェーズ L2', '-'),
          PHASE_GUEST('フェーズ L3', '-'),
          LINE_HORIZONTAL,
          LINE_INFO_PHASES_DE,
        ],
      });
    }
  });
});
