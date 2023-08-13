import * as React from "react";
import {
  Button,
  Textarea,
  TextareaProps,
  tokens,
  Avatar,
  makeStyles,
  shorthands
} from "@fluentui/react-components";
import { SendRegular, Bot24Regular } from "@fluentui/react-icons";
import { Chat, ChatMessage, ChatMyMessage } from '@fluentui-contrib/react-chat';
import { Card, FluentProvider } from "@fluentui/react-components";
import { IChatInputProps, IChatMessage } from "../interface/IChatProps";
import { Loader } from "./Loader";
import { ChatGPTIcon, WelcomeIcon } from "./OpenAIIcon";
import { WelcomeIconInfo } from "../ManifestConstants";
import { powerappsTheme, powerappsdarkTheme } from "./theme";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

const useStyles = makeStyles({
  root: {
    display: "relative",
    ...shorthands.padding("8px"),
    paddingTop: "1px",
    paddingBottom: "2px",
  },
  textareaStyle: {
    ...shorthands.borderStyle("none"),
  }
});

export const ChatComponent = React.memo((props: IChatInputProps) => {
  const { items, placeholdertext, showIcon, loadingText, accessibleLabel, allocatedWidth, allocatedHeight, onSubmit, usePlatformtheme, disabledState, darkMode } = props;
  const [sendBoxValue, setSendBoxValue] = React.useState<string>("");
  const textElement = React.createRef<HTMLTextAreaElement>();
  const messagesEndRef = React.createRef<HTMLDivElement>();
  const styles = useStyles();
  const brandForeground1 = usePlatformtheme ? tokens.colorBrandForeground1 : powerappsTheme.colorBrandForeground1;
  const brandForeground2 = usePlatformtheme ? tokens.colorBrandForeground2 : powerappsTheme.colorBrandForeground2;
  const onSubmitKey = (event: React.KeyboardEvent) => {
    if (!event.shiftKey && event.key === "Enter") {
      onSendSubmit(event);
      event.preventDefault();
    }
  };

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
    }, [sendBoxValue, onSubmit]);

  const chatMessages = React.useMemo(() => {
    // Reset submit state on every item collection change
    return items.map((i: IChatMessage) => {
      return i.role === "assistant" ? <ChatMessage avatar={showIcon ? <Avatar color={"brand"} icon={<Bot24Regular />} /> : <ChatGPTIcon color={brandForeground1} />}><ReactMarkdown>{i.content}</ReactMarkdown></ChatMessage> :
        <ChatMyMessage><ReactMarkdown>{i.content}</ReactMarkdown></ChatMyMessage>;
    });
  }, [items, brandForeground1, showIcon]);

  // When chatmessage changes, scroll to bottom to view latest
  React.useEffect(() => {
    messagesEndRef.current && (messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight);
  }, [chatMessages, messagesEndRef, textElement]);

  const rootStyles = React.useMemo(() => {
    return {
      outerDiv: {
        height: allocatedHeight, width: allocatedWidth
      } as React.CSSProperties,
      chat: {
        overflowY: 'auto',
        maxHeight: allocatedHeight * 0.7,
        height: disabledState ? allocatedHeight * 0.7 - 65 : allocatedHeight * 0.7, // -65 to accomodate loader component height
      } as React.CSSProperties,
      card: {
        height: 135, //fixed height
      } as React.CSSProperties,
      textArea: { border: "none" } as React.CSSProperties,
    };
  }, [allocatedHeight, allocatedWidth, disabledState]);

  // Adding style directly instead of Griffel based to support test harness activity
  const chatbotComponent =
    <div style={rootStyles.outerDiv} aria-label={accessibleLabel}>
      {chatMessages.length < 1 ? <div style={rootStyles.chat}><WelcomeIcon color={brandForeground2} width={(allocatedWidth * 0.7).toString()} height={(allocatedHeight * 0.7 - WelcomeIconInfo.padding).toString()} /></div> :
        <Chat ref={messagesEndRef} style={rootStyles.chat}>
          {chatMessages}
        </Chat>}
      <br />
      {disabledState && <><Loader loadingText={loadingText} /><br /></>}
      <div className={styles.root}>
        <Card style={rootStyles.card}>
          <Textarea
            autoFocus={!disabledState}
            className={styles.textareaStyle}
            placeholder={placeholdertext}
            ref={textElement}
            value={sendBoxValue}
            onChange={onChange}
            disabled={disabledState}
            onKeyDown={onSubmitKey} />
          <Button disabled={disabledState} onClick={onSendSubmit} style={{ marginLeft: "auto", paddingLeft: 5 }} appearance="transparent" icon={<SendRegular style={{ color: brandForeground1 }} />} size="small" />
        </Card>
      </div>
    </div>;

  return usePlatformtheme ? chatbotComponent : <FluentProvider theme={darkMode ? powerappsdarkTheme : powerappsTheme}>{chatbotComponent}</FluentProvider>;
});
ChatComponent.displayName = "ChatComponent";