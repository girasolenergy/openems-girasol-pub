import { TimeUtils } from "./timeutils";
import localeDe from '@angular/common/locales/de'; // 根据实际需要导入对应的语言包
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeDe);
fdescribe('TimeUtils', () => {
  it('#formatSecondsToDuration', () => {
    expect(TimeUtils.formatSecondsToDuration(12000, 'de')).toEqual("3h 20m");
    expect(TimeUtils.formatSecondsToDuration(null, 'de')).toEqual(null);
    expect(TimeUtils.formatSecondsToDuration(undefined, 'de')).toEqual(null);
    expect(TimeUtils.formatSecondsToDuration(12000, null)).toEqual("3h 20m");
  });
});
