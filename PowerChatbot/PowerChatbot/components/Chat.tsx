import * as React from "react";
import {
  Button,
  Textarea,
  BrandVariants,
  createLightTheme,
  createDarkTheme,
  Theme,
  TextareaProps,
  tokens,
  Avatar
} from "@fluentui/react-components";
import { SendRegular, Bot24Regular } from "@fluentui/react-icons";
import { Chat, ChatMessage, ChatMyMessage } from '@fluentui-contrib/react-chat';
import { Card, FluentProvider } from "@fluentui/react-components";
import { IChatInputProps, IChatMessage } from "../interface/IChatProps";
import { Loader } from "./Loader";
import { ChatGPTIcon, WelcomeIcon } from "./OpenAIIcon";
import { WelcomeIconInfo } from "../ManifestConstants";

// Powerapps purple color brand
const powerappsBrand: BrandVariants = {
  10: "#050205",
  20: "#221221",
  30: "#3A193A",
  40: "#4E1E4E",
  50: "#632363",
  60: "#762B76",
  70: "#823C81",
  80: "#8D4D8B",
  90: "#985D96",
  100: "#A36EA0",
  110: "#AE7EAB",
  120: "#B98FB6",
  130: "#C49FC1",
  140: "#CFB0CC",
  150: "#D9C1D7",
  160: "#E4D3E3"
  };

   const powerappsTheme: Theme = {
     ...createLightTheme(powerappsBrand),
  };

   const powerappsdarkTheme: Theme = {
     ...createDarkTheme(powerappsBrand),
  };


  powerappsdarkTheme.colorBrandForeground1 = powerappsBrand[110];
  powerappsdarkTheme.colorBrandForeground2 = powerappsBrand[120];


export const ChatComponent = React.memo((props:IChatInputProps) => {
  const {items, placeholdertext, showIcon, loadingText, accessibleLabel, allocatedWidth, allocatedHeight, onSubmit, usePlatformtheme, disabledState} = props;
  const [sendBoxValue, setSendBoxValue] = React.useState<string>("");
	const textElement = React.createRef<HTMLTextAreaElement>();
  const messagesEndRef = React.createRef<HTMLDivElement>()
  const brandForeground1 = usePlatformtheme ? tokens.colorBrandForeground1 : powerappsTheme.colorBrandForeground1;
  const brandForeground2 = usePlatformtheme ? tokens.colorBrandForeground2 : powerappsTheme.colorBrandForeground2;
  const onSubmitKey = (event: React.KeyboardEvent ) => {
  if (!event.shiftKey && event.key === "Enter") {
      onSendSubmit(event);
      event.preventDefault();
    }
  }

const onChange: TextareaProps["onChange"] = (ev, data) => {
  if (data.value.length <= 5000) {
    setSendBoxValue(data.value);
  }
};

const onSendSubmit = React.useCallback(
  (event: React.KeyboardEvent | React.MouseEvent) => {
    event.preventDefault();
    if (sendBoxValue.length > 0) {
      onSubmit(sendBoxValue);
      // Reset after submit state
      setSendBoxValue("");
    }
  },[sendBoxValue]);

  const chatMessages = React.useMemo(() => {
    // Reset submit state on every item collection change
    return items.map((i: IChatMessage) => {
      return i.role === "assistant" ? <ChatMessage avatar={showIcon ? <Avatar color={"brand"} icon={<Bot24Regular/>} /> : <ChatGPTIcon color={brandForeground1}/>}>{i.content}</ChatMessage> :
      <ChatMyMessage>{i.content}</ChatMyMessage>
    });
  }, [items]);

  // When chatmessage changes, scroll to bottom to view latest
  React.useEffect(()=>{
    messagesEndRef.current && (messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight);
  },[chatMessages]);

  // Adding style directly instead of Griffel based to support test harness activity
  const chatbotComponent =
    <div style={{height:allocatedHeight,width:allocatedWidth}}>
        <Chat ref={messagesEndRef} style={{ overflowY: 'auto', height:allocatedHeight * 0.7, maxHeight:allocatedHeight * 0.7}}>
          {chatMessages.length < 1 ? <WelcomeIcon color={brandForeground2} width={(allocatedWidth - WelcomeIconInfo.padding).toString()} height={(allocatedWidth - WelcomeIconInfo.padding).toString()}/> : chatMessages}
        </Chat>
        <br/>
        {disabledState && <Loader loadingText={loadingText}/>}
        <br/>
            <Card style={{ height : allocatedHeight * 0.2}} tabIndex={-1}>
          <Textarea
            style={{border:"none"}}
            aria-label={accessibleLabel}
            placeholder={placeholdertext}
            ref={textElement}
            value={sendBoxValue}
            onChange={onChange}
            disabled={disabledState}
            onKeyDown={onSubmitKey}/>
          <Button disabled={disabledState} onClick={onSendSubmit} style={{marginLeft: "auto", paddingLeft:5}} appearance="transparent" icon={<SendRegular style={{color:brandForeground1}}/>} size="small" />
        </Card>
    </div>;

  return usePlatformtheme ? chatbotComponent : <FluentProvider theme={powerappsTheme}>{chatbotComponent}</FluentProvider> ;
});
ChatComponent.displayName = "ChatComponent";