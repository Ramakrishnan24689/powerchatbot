import * as React from "react";
import { Card, Label, makeStyles, shorthands, ProgressBar } from "@fluentui/react-components";
import { ILoaderProps } from "../interface/IChatProps";

// Effort to match co-pilot styling
const useStyles = makeStyles({
	root: {
		display: "relative",
		...shorthands.padding("8px"),
		paddingTop: "1px",
		paddingBottom: "2px",
	},
	cardStyle: {
		display: "block",
		...shorthands.padding(0),
		...shorthands.borderRadius("8px"),
	},
	cardInnerStyle: {
		...shorthands.padding("10px", "12px"),
	},
});

export const Loader = (props: ILoaderProps) => {
	const styles = useStyles();
	return (<div className={styles.root}>
		<Card className={styles.cardStyle}>
			<div className={styles.cardInnerStyle} aria-live="polite">
				<Label weight="semibold">{props.loadingText}</Label>
			</div>
			<ProgressBar />
		</Card>
	</div>);
};