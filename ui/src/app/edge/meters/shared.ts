import { ChannelAddress, Service } from "src/app/shared/shared";
import { differenceInDays, differenceInMinutes, startOfDay } from "date-fns";

import { QueryHistoricTimeseriesDataResponse } from "src/app/shared/jsonrpc/response/queryHistoricTimeseriesDataResponse";

export interface Dataset {
    label: string;
    data: number[];
    hidden: boolean;
}

export const EMPTY_DATASET = [{
    label: "no Data available",
    data: [],
    hidden: false,
}];

export type Data = {
    labels: Date,
    datasets: {
        backgroundColor: string,
        borderColor: string,
        data: number[],
        label: string,
        _meta: {}
    }[]
};

export type TooltipItem = {
    datasetIndex: number,
    index: number,
    x: number,
    xLabel: Date,
    value: number,
    y: number,
    yLabel: number
};

export type ChartOptions = {
    layout?: {
        padding: {
            left: number,
            right: number,
            top: number,
            bottom: number
        }
    }
    responsive?: boolean,
    maintainAspectRatio: boolean,
    elements: {
        point: {
            radius: number,
            hitRadius: number,
            hoverRadius: number
        },
        line: {
            borderWidth: number,
            tension: number
        },
        rectangle: {
            borderWidth: number,
        }
    },
    hover: {
        mode: string,
        intersect: boolean
    },
    scales: {
        yAxes: [{
            id?: string,
            position: string,
            scaleLabel: {
                display: boolean,
                labelString: string,
                padding?: number,
                fontSize?: number
            },
            gridLines?: {
                display: boolean
            },
            ticks: {
                beginAtZero: boolean,
                max?: number,
                padding?: number,
                stepSize?: number,
                callback?(value: number | string, index: number, values: number[] | string[]): string | number | null | undefined;
            }
        }],
        xAxes: [{
            bounds?: string,
            offset?: boolean,
            stacked: boolean,
            type: "time",
            time: {
                stepSize?: number,
                unit?: string,
                minUnit: string,
                displayFormats: {
                    millisecond: string,
                    second: string,
                    minute: string,
                    hour: string,
                    day: string,
                    week: string,
                    month: string,
                    quarter: string,
                    year: string
                }
            },
            ticks: {
                source?: string,
                maxTicksLimit?: number
            }
        }]
    },
    tooltips: {
        mode: string,
        intersect: boolean,
        axis: string,

        callbacks: {
            label?(tooltipItem: TooltipItem, data: Data): string,
            title?(tooltipItems: TooltipItem[], data: Data): string,
        }
    }
};

export const DEFAULT_TIME_CHART_OPTIONS: ChartOptions = {
    maintainAspectRatio: false,
    elements: {
        point: {
            radius: 0,
            hitRadius: 0,
            hoverRadius: 0,
        },
        line: {
            borderWidth: 2,
            tension: 0.1,
        },
        rectangle: {
            borderWidth: 2,
        },
    },
    hover: {
        mode: "point",
        intersect: true,
    },
    scales: {
        yAxes: [{
            position: "left",
            scaleLabel: {
                display: true,
                labelString: "",
            },
            ticks: {
                beginAtZero: true,
            },
        }],
        xAxes: [{
            ticks: {},
            stacked: false,
            type: "time",
            time: {
                minUnit: "hour",
                displayFormats: {
                    millisecond: "SSS [ms]",
                    second: "HH:mm:ss a", // 17:20:01
                    minute: "HH:mm", // 17:20
                    hour: "HH:[00]", // 17:20
                    day: "DD", // Sep 04 2015
                    week: "ll", // Week 46, or maybe "[W]WW - YYYY" ?
                    month: "MM", // September
                    quarter: "[Q]Q - YYYY", // Q3 - 2015
                    year: "YYYY", // 2015,
                },
            },
        }],
    },
    tooltips: {
        mode: "index",
        intersect: false,
        axis: "x",
        callbacks: {
            title(tooltipItems: TooltipItem[], data: Data): string {
                const date = new Date(tooltipItems[0].xLabel);
                return date.toLocaleDateString() + " " + date.toLocaleTimeString();
            },
        },
    },
};
export function calculateActiveTimeOverPeriod(channel: ChannelAddress, queryResult: QueryHistoricTimeseriesDataResponse["result"]) {
    const startDate = startOfDay(new Date(queryResult.timestamps[0]));
    const endDate = new Date(queryResult.timestamps[queryResult.timestamps.length - 1]);
    let activeSum = 0;
    queryResult.data[channel.toString()].forEach(value => {
        activeSum += value;
    });
    const activePercent = activeSum / queryResult.timestamps.length;
    return (differenceInMinutes(endDate, startDate) * activePercent) * 60;
}

/**
   * Calculates resolution from passed Dates for queryHistoricTime-SeriesData und -EnergyPerPeriod &&
   * Calculates timeFormat from passed Dates for xAxes of chart
   *
   * @param service the Service
   * @param fromDate the From-Date
   * @param toDate the To-Date
   * @returns resolution and timeformat
   */
export function calculateResolution(service: Service, fromDate: Date, toDate: Date): { resolution: Resolution, timeFormat: "day" | "month" | "hour" } {

    const days = Math.abs(differenceInDays(toDate, fromDate));
    let resolution: { resolution: Resolution, timeFormat: "day" | "month" | "hour" };

    if (days <= 1) {// If date range is less than 1 day, use 5-30 minute resolution
      //resolution = { resolution: { value: 30, unit: Unit.MINUTES }, timeFormat: 'hour' }
      resolution = { resolution: { value: 1, unit: ChronoUnit.Type.HOURS }, timeFormat: "day" };
    } else if (days == 2) {// If date range is between 2 and 4 days, use 1 hour resolution
        if (service.isSmartphoneResolution) {
            resolution = { resolution: { value: 1, unit: ChronoUnit.Type.DAYS }, timeFormat: "day" }; // 1 Day
        } else {
            resolution = { resolution: { value: 30, unit: ChronoUnit.Type.MINUTES }, timeFormat: "hour" }; // 1 Hour
        }

    } else if (days <= 4) {
        if (service.isSmartphoneResolution) {
            resolution = { resolution: { value: 1, unit: ChronoUnit.Type.DAYS }, timeFormat: "day" }; // 1 Day
        } else {
            resolution = { resolution: { value: 1, unit: ChronoUnit.Type.HOURS }, timeFormat: "hour" }; // 1 Hour
        }

    } else if (days <= 6) {
        // >> show Hours
        resolution = { resolution: { value: 1, unit: ChronoUnit.Type.HOURS }, timeFormat: "day" }; // 1 Day

    } else if (days <= 31 && service.isSmartphoneResolution) {
        // Smartphone-View: show 31 days in daily view
        resolution = { resolution: { value: 1, unit: ChronoUnit.Type.DAYS }, timeFormat: "day" }; // 1 Day

    } else if (days <= 90) {
        resolution = { resolution: { value: 1, unit: ChronoUnit.Type.DAYS }, timeFormat: "day" }; // 1 Day

    } else if (days <= 144) {
        // >> show Days
        if (service.isSmartphoneResolution == true) {
            resolution = { resolution: { value: 1, unit: ChronoUnit.Type.MONTHS }, timeFormat: "month" }; // 1 Month
        } else {
            resolution = { resolution: { value: 1, unit: ChronoUnit.Type.DAYS }, timeFormat: "day" }; // 1 Day
        }

    } else {
        // >> show Months
        resolution = { resolution: { value: 1, unit: ChronoUnit.Type.MONTHS }, timeFormat: "month" }; // 1 Month
    }
    return resolution;
}

/**
  * Returns true if Chart Label should be visible. Defaults to to true.
  *
  * Compares only the first part of the label string - without a value or unit.
  *
  * @param label the Chart label
  * @param orElse the default, in case no value was stored yet in Session-Storage
  * @returns true for visible labels; hidden otherwise
  */
export function isLabelVisible(label: string, orElse?: boolean): boolean {
    const labelWithoutUnit = "LABEL_" + label.split(" ")[0];
    const value = sessionStorage.getItem(labelWithoutUnit);
    if (orElse != null && value == null) {
        return orElse;
    } else {
        return value !== "false";
    }
}

/**
 * Stores if the Label should be visible or hidden in Session-Storage.
 *
 * @param label the Chart label
 * @param visible true to set the Label visibile; false to hide ite
 */
export function setLabelVisible(label: string, visible: boolean | null): void {
    if (visible == null) {
        return;
    }
    const labelWithoutUnit = "LABEL_" + label.split(" ")[0];
    sessionStorage.setItem(labelWithoutUnit, visible ? "true" : "false");
}

export type Resolution = {
    value: number,
    unit: ChronoUnit.Type
};
export namespace ChronoUnit {

  export enum Type {
      SECONDS = "Seconds",
      MINUTES = "Minutes",
      HOURS = "Hours",
      DAYS = "Days",
      MONTHS = "Months",
      YEARS = "Years",
  }

  /**
   * Evaluates whether "ChronoUnit 1" is equal or a bigger period than "ChronoUnit 2".
   *
   * @param unit1     the ChronoUnit 1
   * @param unit2     the ChronoUnit 2
   * @return true if "ChronoUnit 1" is equal or a bigger period than "ChronoUnit 2"
   */
  export function isAtLeast(unit1: Type, unit2: Type) {
      const currentUnit = Object.values(Type).indexOf(unit1);
      const unitToCompareTo = Object.values(Type).indexOf(unit2);
      return currentUnit >= unitToCompareTo;
  }
}

// export enum Unit {
//     SECONDS = "Seconds",
//     MINUTES = "Minutes",
//     HOURS = "Hours",
//     DAYS = "Days",
//     MONTHS = "Months",
// }

export type ChartData = {
    channel: {
        name: string,
        powerChannel: ChannelAddress,
        energyChannel: ChannelAddress
        filter?: ChannelFilter
    }[],
    displayValue: {
        /** Name displayed in Label */
        name: string,
        /**  */
        getValue: any,

        hidden?: boolean,
        /** color in rgb-Format */
        color: string;
    }[],
    tooltip: {
        /** Unit to be displayed as Tooltips unit */
        unit: "%" | "kWh" | "kW",
        /** Format of Number displayed */
        formatNumber: string;
    },
    /** Name to be displayed on the left y-axis */
    yAxisTitle: string,
};
// Should be renamed
export enum ChannelFilter {
    NOT_NULL,
    NOT_NULL_OR_NEGATIVE,
    NOT_NULL_OR_POSITIVE,
}
