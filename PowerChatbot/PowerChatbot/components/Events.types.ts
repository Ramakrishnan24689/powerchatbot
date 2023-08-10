/*specifying events types here until it is unlocked by platform*/
export interface IPropBag<T> extends ComponentFramework.Context<T> {
    parameters: T;
    events: IEventBag;
}
export declare type IEventBag = Record<string, () => void>;
