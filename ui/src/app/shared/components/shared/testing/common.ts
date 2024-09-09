import { TimeUnit } from "chart.js";
import { QueryHistoricTimeseriesDataResponse } from "src/app/shared/jsonrpc/response/queryHistoricTimeseriesDataResponse";
import { QueryHistoricTimeseriesEnergyPerPeriodResponse } from "src/app/shared/jsonrpc/response/queryHistoricTimeseriesEnergyPerPeriodResponse";
import { QueryHistoricTimeseriesEnergyResponse } from "src/app/shared/jsonrpc/response/queryHistoricTimeseriesEnergyResponse";

import { ChartConstants } from "../../chart/chart.constants";
import { OeChartTester } from "./tester";

export namespace OeTester {

  export namespace Types {
    export type Channels = {

      /** Always one value for each channel from a {@link QueryHistoricTimeseriesEnergyResponse} */
      energyChannelWithValues: QueryHistoricTimeseriesEnergyResponse,

      /** data from a {@link QueryHistoricTimeseriesEnergyPerPeriodResponse} */
      energyPerPeriodChannelWithValues?: QueryHistoricTimeseriesEnergyPerPeriodResponse,
      /** data from a {@link QueryHistoricTimeseriesDataResponse} */
      dataChannelWithValues?: QueryHistoricTimeseriesDataResponse
    };
  }

  export namespace ChartOptions {
    export const LINE_CHART_OPTIONS = (period: string, chartType: "line" | "bar", options: { [key: string]: { scale: { min?: number, max?: number; beginAtZero?: boolean; }, ticks?: { stepSize: number; }; }; }, title?: string): OeChartTester.Dataset.Option => ({
      type: "option",
      options: {
        "responsive": true, "maintainAspectRatio": false, "elements": { "point": { "radius": 0, "hitRadius": 0, "hoverRadius": 0 }, "line": { "stepped": false, "fill": true } }, "datasets": { "bar": {}, "line": {} }, "plugins": { "colors": { "enabled": false }, "legend": { "display": true, "position": "bottom", "labels": { "color": "" } }, "tooltip": { "intersect": false, "mode": "index", "callbacks": {} }, "annotation": { "annotations": {} } }, "scales": {
          "x": { "stacked": true, "offset": false, "type": "time", "ticks": { "source": "auto", "maxTicksLimit": 31 }, "bounds": "ticks", "adapters": { "date": { "locale": { "code": "ja", "formatLong": {}, "localize": {}, "match": {}, "options": { "weekStartsOn": 0, "firstWeekContainsDate": 1 } } } }, "time": { "unit": period as TimeUnit, "displayFormats": { "datetime": "yyyy-MM-dd HH:mm:ss", "millisecond": "SSS [ms]", "second": "HH:mm:ss a", "minute": "HH:mm", "hour": "HH:00", "day": "dd", "week": "ll", "month": "MM", "quarter": "[Q]Q - YYYY", "year": "yyyy" } } },
          "left": {
            ...options["left"]?.scale, ...(chartType === "line" ? { stacked: false } : {}), "beginAtZero": options["left"]?.scale.beginAtZero ?? false, "title": { "text": "kW", "display": false, "padding": 5, "font": { "size": 11 } }, "position": "left", "grid": { "display": true },
            "ticks": {
              ...options["left"]?.ticks,
              "color": "",
              "padding": 5,
              "maxTicksLimit": ChartConstants.NUMBER_OF_Y_AXIS_TICKS,
            },
          },
        },
      },
    });
    export const BAR_CHART_OPTIONS = (period: string, chartType: "line" | "bar", options: { [key: string]: { scale: { min: number, max: number; }, ticks?: { stepSize: number; }; }; }, title?: string): OeChartTester.Dataset.Option => ({
      type: "option",
      options: {
        "responsive": true, "maintainAspectRatio": false, "elements": { "point": { "radius": 0, "hitRadius": 0, "hoverRadius": 0 }, "line": { "stepped": false, "fill": true } }, "datasets": { "bar": { "barPercentage": 1 }, "line": {} }, "plugins": { "colors": { "enabled": false }, "legend": { "display": true, "position": "bottom", "labels": { "color": "" } }, "tooltip": { "intersect": false, "mode": "x", "callbacks": {} }, "annotation": { "annotations": {} } }, "scales": {
          "x": { "stacked": true, "offset": true, "type": "time", "ticks": { "source": "auto", "maxTicksLimit": 31 }, "bounds": "ticks", "adapters": { "date": { "locale": { "code": "ja", "formatLong": {}, "localize": {}, "match": {}, "options": { "weekStartsOn": 0, "firstWeekContainsDate": 1 } } } }, "time": { "unit": period as TimeUnit, "displayFormats": { "datetime": "yyyy-MM-dd HH:mm:ss", "millisecond": "SSS [ms]", "second": "HH:mm:ss a", "minute": "HH:mm", "hour": "HH:00", "day": "dd", "week": "ll", "month": "MM", "quarter": "[Q]Q - YYYY", "year": "yyyy" } } },
          "left": {
            ...options["left"]?.scale, ...(chartType === "line" ? { stacked: false } : {}), "beginAtZero": true, "title": { "text": "kWh", "display": false, "padding": 5, "font": { "size": 11 } }, "position": "left", "grid": { "display": true },
            "ticks": {
              ...options["left"]?.ticks,
              "color": "",
              "padding": 5,
              "maxTicksLimit": ChartConstants.NUMBER_OF_Y_AXIS_TICKS,
            },
          },
        },
      },
    });
    export const MULTI_LINE_OPTIONS = (period: string, chartType: "line" | "bar", options: { [key: string]: { scale: { min: number, max: number; }, ticks?: { stepSize: number; }; }; }, title?: string): OeChartTester.Dataset.Option => ({
      type: "option",
      options: {
        "responsive": true, "maintainAspectRatio": false, "elements": { "point": { "radius": 0, "hitRadius": 0, "hoverRadius": 0 }, "line": { "stepped": false, "fill": true } }, "datasets": { "bar": {}, "line": {} }, "plugins": { "colors": { "enabled": false }, "legend": { "display": true, "position": "bottom", "labels": { "color": "" } }, "tooltip": { "intersect": false, "mode": "index", "callbacks": {} }, "annotation": { "annotations": {} } }, "scales": {
          "x": { "stacked": true, "offset": false, "type": "time", "ticks": { "source": "auto", "maxTicksLimit": 31 }, "bounds": "ticks", "adapters": { "date": { "locale": { "code": "ja", "formatLong": {}, "localize": {}, "match": {}, "options": { "weekStartsOn": 0, "firstWeekContainsDate": 1 } } } }, "time": { "unit": period as TimeUnit, "displayFormats": { "datetime": "yyyy-MM-dd HH:mm:ss", "millisecond": "SSS [ms]", "second": "HH:mm:ss a", "minute": "HH:mm", "hour": "HH:00", "day": "dd", "week": "ll", "month": "MM", "quarter": "[Q]Q - YYYY", "year": "yyyy" } } }, "left": {
            ...options["left"]?.scale, ...(chartType === "line" ? { stacked: false } : {}), "beginAtZero": true,
            "title": { "text": "kW", "display": true, "padding": 5, "font": { "size": 11 } },
            "position": "left", "grid": { "display": true },
            "ticks": {
              ...options["left"]?.ticks,
              "color": "",
              "padding": 5,
              "maxTicksLimit": ChartConstants.NUMBER_OF_Y_AXIS_TICKS,
            },
          },
          "right": {
            ...options["right"]?.scale, ...(chartType === "line" ? { stacked: false } : {}), "beginAtZero": true,
            "title": { "text": "状態", "display": true, "padding": 5, "font": { "size": 11 } },
            "position": "right", "grid": { "display": false },
            "ticks": {
              ...options["right"]?.ticks,
              "color": "",
              "padding": 5,
              "maxTicksLimit": ChartConstants.NUMBER_OF_Y_AXIS_TICKS,
            },
          },
        },
      },
    });
    export const MULTI_BAR_OPTIONS = (period: string, chartType: "line" | "bar", options: { [key: string]: { scale: { min?: number, max?: number; }, ticks?: { stepSize: number; }; }; }, title?: string): OeChartTester.Dataset.Option => ({
      type: "option",
      options: {
        "responsive": true, "maintainAspectRatio": false, "elements": { "point": { "radius": 0, "hitRadius": 0, "hoverRadius": 0 }, "line": { "stepped": false, "fill": true } }, "datasets": { "bar": { "barPercentage": 1 }, "line": {} }, "plugins": { "colors": { "enabled": false }, "legend": { "display": true, "position": "bottom", "labels": { "color": "" } }, "tooltip": { "intersect": false, "mode": "x", "callbacks": {} }, "annotation": { "annotations": {} } }, "scales": {
          "x": { "stacked": true, "offset": true, "type": "time", "ticks": { "source": "auto", "maxTicksLimit": 31 }, "bounds": "ticks", "adapters": { "date": { "locale": { "code": "ja", "formatLong": {}, "localize": {}, "match": {}, "options": { "weekStartsOn": 0, "firstWeekContainsDate": 1 } } } }, "time": { "unit": period as TimeUnit, "displayFormats": { "datetime": "yyyy-MM-dd HH:mm:ss", "millisecond": "SSS [ms]", "second": "HH:mm:ss a", "minute": "HH:mm", "hour": "HH:00", "day": "dd", "week": "ll", "month": "MM", "quarter": "[Q]Q - YYYY", "year": "yyyy" } } },
          "left": {
            ...options["left"]?.scale, ...(chartType === "line" ? { stacked: false } : {}), "beginAtZero": true, "title": { "text": "kWh", "display": true, "padding": 5, "font": { "size": 11 } }, "position": "left", "grid": { "display": true },
            "ticks": {
              ...options["left"]?.ticks,
              "color": "",
              "padding": 5,
              "maxTicksLimit": ChartConstants.NUMBER_OF_Y_AXIS_TICKS,
            },
          },
          "right": {
            ...options["right"]?.scale, ...(chartType === "line" ? { stacked: false } : { min: 0 }), "beginAtZero": true,
            "title": { "text": "アクティブ時間", "display": true, "padding": 5, "font": { "size": 11 } },
            "position": "right", "grid": { "display": false },
            "ticks": {
              "color": "",
              "padding": 5,
              "maxTicksLimit": ChartConstants.NUMBER_OF_Y_AXIS_TICKS,
            },
          },
        },
      },
    });
  }
}