export interface IChatInputProps {
    items: IChatMessage[];
    botName: string;
    placeholdertext:string;
    showIcon: boolean;
    allocatedHeight: number;
    allocatedWidth: number;
    loadingText: string;
    accessibleLabel: string;
    onSubmit: (value:string) => void;
    usePlatformtheme: boolean;
    disabledState: boolean;
  }

export interface IChatMessage {
    key:string;
    content:string;
    role:string;
}

export interface ILoaderProps {
    loadingText:string;
}

export interface IIconProps {
    width?:string;
    height?:string;
    color:string;
}

export interface IAvatarProps {
    themeColor:string
    botName:string;
}