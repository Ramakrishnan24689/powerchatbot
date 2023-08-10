import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { ChatComponent } from "./components/Chat";
import * as React from "react";
import { ManifestPropertyNames } from "./ManifestConstants";
import { Column, RecordSet } from "./components/Component.types";
import { IChatInputProps, IChatMessage } from "./interface/IChatProps";
import { IPropBag } from "./components/Events.types";

export class PowerChatbot implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private static readonly DATASET_PAGE_SIZE: number = 1000;
    notifyOutputChanged: () => void;
    items: IChatMessage[];
    context: IPropBag<IInputs>;
    submittedText: string;
    eventtobeTriggered: boolean;
    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: IPropBag<IInputs>, notifyOutputChanged: () => void): void {
        this.context = context;
        this.context.mode.trackContainerResize(true);
        this.notifyOutputChanged = notifyOutputChanged;
        // Upper limit of options to fetch.
        if (context.parameters.Items.paging.pageSize !== PowerChatbot.DATASET_PAGE_SIZE) {
            context.parameters.Items.paging.setPageSize(PowerChatbot.DATASET_PAGE_SIZE);
            context.parameters.Items.refresh();
        }
        this._onSubmit = this._onSubmit.bind(this);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: IPropBag<IInputs>): React.ReactElement {
        const { columns, records, sortedRecordIds } = context.parameters.Items;
        const datasetChanged = context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 || !this.items;
        const botName = context.parameters.BotName.raw ?? '';
        const showIcon = context.parameters.ShowIcon.raw;
        const accessibleLabel = context.parameters.AccessibleLabel.raw;
        const loadingText = context.parameters.LoadingText.raw ?? '';
        const placeholdertext = context.parameters.PlaceholderText.raw ?? '';
        const usePlatformtheme = context.parameters.Useplatformtheme.raw;
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        if (datasetChanged) {
            this.items = this.createOptionItems(columns, records, sortedRecordIds);
        }
        this.eventtobeTriggered && this.triggerOnSubmit();
        const chatComponentProps = {
                                        items:this.items,
                                        botName: botName,
                                        showIcon: showIcon,
                                        placeholdertext:placeholdertext,
                                        allocatedWidth: allocatedWidth,
                                        allocatedHeight: allocatedHeight,
                                        loadingText: loadingText,
                                        accessibleLabel: accessibleLabel,
                                        onSubmit:this._onSubmit,
                                        disabledState: this.disableChatComponent(records, sortedRecordIds),
                                        usePlatformtheme: usePlatformtheme
                                    } as IChatInputProps;
        return React.createElement(
            ChatComponent, chatComponentProps
        );
    }

    private triggerOnSubmit() {
        this.eventtobeTriggered = false;
        console.log("OnSubmit");
        this.submittedText = "";
        this.context.events.OnSubmit();
    }

    private _onSubmit(submittedText: string): void {
        this.eventtobeTriggered = true;
        this.submittedText = submittedText;
        this.notifyOutputChanged();
    }

    private disableChatComponent(records: RecordSet, sortedRecordIds: string[]): Boolean {
        if (sortedRecordIds.length > 0) {
            // false - if last record is from Open AI - 'assistance'
           return records[sortedRecordIds[sortedRecordIds.length-1]].getFormattedValue('role') === 'user'
        }
        return false;
    }

    private createOptionItems(columns: Column[], records: RecordSet, sortedRecordIds: string[]): IChatMessage[] {
        if (!sortedRecordIds.length || records.error) {
            return [];
        }
        // take first column alias, or undefined if no column is specified.
        let contentcolumnAlias = columns[0] && columns[0].alias;
        let rolecolumnAlias = columns[1] && columns[1].alias;
        // if no column is specified and the first record has a value column, use that.
        if (!contentcolumnAlias && records[sortedRecordIds[0]].getFormattedValue('content') !== null &&
        !contentcolumnAlias && records[sortedRecordIds[0]].getFormattedValue('role') !== null) {
            contentcolumnAlias = 'content';
            rolecolumnAlias = 'role';
        }

        // for each record, return formatted value, or recordId if no column is specified.
        return sortedRecordIds.map((recordId) => {
            const content = contentcolumnAlias
                ? (records[recordId] && records[recordId].getFormattedValue(contentcolumnAlias)) || ''
                : recordId;
            const role = rolecolumnAlias
                ? (records[recordId] && records[recordId].getFormattedValue(rolecolumnAlias)) || ''
                : recordId;

            return {
                key: recordId,
                content: content,
                role: role
            };
        });
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { SubmittedText: this.submittedText };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
