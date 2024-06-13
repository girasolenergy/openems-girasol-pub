import { TimeUtils } from "./timeutils";

describe('TimeUtils', () => {
  it('#formatSecondsToDuration', () => {
    expect(TimeUtils.formatSecondsToDuration(12000, 'ja')).toEqual("3h 20m");
    expect(TimeUtils.formatSecondsToDuration(null, 'ja')).toEqual(null);
    expect(TimeUtils.formatSecondsToDuration(undefined, 'ja')).toEqual(null);
    expect(TimeUtils.formatSecondsToDuration(12000, null)).toEqual("3h 20m");
  });
});
