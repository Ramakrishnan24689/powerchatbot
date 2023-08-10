export type Column = ComponentFramework.PropertyHelper.DataSetApi.Column;
export type Record = ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;
export type RecordSet = { [id: string]: Record };
export type DataSet = ComponentFramework.PropertyTypes.DataSet;

/**
 * PCF-side Interface implementation of FluentUI ISelecctableOption
 */
export interface IDataSetOption {
    /**
     * Key: PCF type is string, FluentUI type is string | number
     */
    key: string;
    /**
     * Text: display text
     */
    text: string;
}
