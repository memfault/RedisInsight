import { Selector, t } from 'testcafe';

export class WorkbenchPage {
    //CSS selectors
    cssSelectorPaginationButtonPrevious = '[data-test-subj=pagination-button-previous]';
    cssSelectorPaginationButtonNext = '[data-test-subj=pagination-button-next]';
    cssReRunCommandButton = '[data-testid=re-run-command]';
    cssDeleteCommandButton = '[data-testid=delete-command]';
    cssQueryCardOutputResponseSuccess = '[data-testid=query-card-output-response-success]';
    cssQueryCardOutputResponseFailed = '[data-testid=query-card-output-response-failed]';
    cssTableViewTypeOption = '[data-testid=view-type-selected-Plugin-redisearch__redisearch]';
    cssMonacoCommandPaletteLine = '[aria-label="Command Palette"]';
    cssQueryTextResult = '[data-testid=query-cli-result]';
    cssQueryTableResult = '[data-testid^=query-table-result-]';
    queryGraphContainer = '[data-testid=query-graph-container]';
    cssQueryCardCommand = '[data-testid=query-card-command]';
    cssQueryCardCommandResult = '[data-testid=query-common-result]';
    cssCustomPluginTableResult = '[data-testid^=query-table-result-client]';
    cssCommandExecutionDateTime = '[data-testid=command-execution-date-time]';
    //-------------------------------------------------------------------------------------------
    //DECLARATION OF SELECTORS
    //*Declare all elements/components of the relevant page.
    //*Target any element/component via data-id, if possible!
    //*The following categories are ordered alphabetically (Alerts, Buttons, Checkboxes, etc.).
    //-------------------------------------------------------------------------------------------
    //BUTTONS
    submitCommandButton = Selector('[data-testid=btn-submit]');
    resizeButtonForScriptingAndResults = Selector('[data-test-subj=resize-btn-scripting-area-and-results]');
    collapsePreselectAreaButton = Selector('[data-testid=collapse-enablement-area]');
    expandPreselectAreaButton = Selector('[data-testid=expand-enablement-area]');
    paginationButtonPrevious = Selector(this.cssSelectorPaginationButtonPrevious);
    paginationButtonNext = Selector(this.cssSelectorPaginationButtonNext);
    preselectList = Selector('[data-testid*=preselect-List]');
    preselectHashCreate = Selector('[data-testid=preselect-Create]');
    preselectIndexInfo = Selector('[data-testid*=preselect-Index]');
    preselectSearch = Selector('[data-testid=preselect-Search]');
    preselectExactSearch = Selector('[data-testid="preselect-Exact text search"]');
    preselectCreateHashIndex = Selector('[data-testid="preselect-Create a hash index"]');
    preselectGroupBy = Selector('[data-testid*=preselect-Group]');
    preselectButtons = Selector('[data-testid^=preselect-]');
    reRunCommandButton = Selector('[data-testid=re-run-command]');
    preselectManual = Selector('[data-testid=preselect-Manual]');
    enablementAreaPagination = Selector('[data-testid=enablement-area__pagination-popover-btn]');
    paginationPopoverButtons = Selector('[data-testid=enablement-area__pagination-popover] button');
    fullScreenButton = Selector('[data-testid=toggle-full-screen]');
    cancelButton = Selector('[data-testid=cancel-btn]');
    applyButton = Selector('[data-testid=apply-btn]');
    documentButtonInQuickGuides = Selector('[data-testid=accordion-button-document]');
    redisStackTutorialsButton = Selector('[data-testid=accordion-button-redis_stack]');
    nextPageButton = Selector('[data-testid=enablement-area__next-page-btn]');
    prevPageButton = Selector('[data-testid=enablement-area__prev-page-btn]');
    hashWithVectorButton = Selector('[data-testid="preselect-A hash with vector embeddings"]');
    createGraphBikeButton = Selector('[data-testid="preselect-Create a bike node"]');
    preselectModelBikeSalesButton = Selector('[data-testid="preselect-Model bike sales"]');
    showSalesPerRegiomButton = Selector('[data-testid="preselect-Show all sales per region"]');
    queryCardNoModuleButton = Selector('[data-testid=query-card-no-module-button] a');
    //ICONS
    noCommandHistoryIcon = Selector('[data-testid=wb_no-results__icon]');
    //LINKS
    timeSeriesLink = Selector('[data-testid=internal-link-redis_for_time_series]');
    redisStackLinks = Selector('[data-testid=accordion-redis_stack] [data-testid^=internal-link]');
    workingWithGraphLink = Selector('[data-testid=internal-link-working_with_graphs]');
    internalLinkWorkingWithHashes = Selector('[data-testid=internal-link-working-with-hashes]');
    vectorSimilitaritySearchButton = Selector('[data-testid=internal-link-vector_similarity_search]');
    //TEXT INPUTS (also referred to as 'Text fields')
    queryInput = Selector('[data-testid=query-input-container]');
    iframe = Selector('[data-testid=pluginIframe]');
    //TEXT ELEMENTS
    queryPluginResult = Selector('[data-testid=query-plugin-result]');
    resposeInfo = Selector('[class="responseInfo"]');
    scriptsLines = Selector('[data-testid=query-input-container] .view-lines');
    queryCardContainer = Selector('[data-testid^=query-card-container]');
    queryCardCommand = Selector('[data-testid=query-card-command]');
    queryTableResult = Selector('[data-testid^=query-table-result-]');
    mainEditorArea = Selector('[data-testid=main-input-container-area]')
    queryTextResult = Selector(this.cssQueryTextResult);
    queryColumns = Selector('[data-testid*=query-column-]');
    queryInputScriptArea = Selector('[data-testid=query-input-container] .view-line');
    overviewTotalKeys = Selector('[data-test-subj=overview-total-keys]');
    overviewTotalMemory = Selector('[data-test-subj=overview-total-memory]');
    queryCardNoModuleOutput = Selector('[data-testid=query-card-no-module-output]');
    noCommandHistorySection = Selector('[data-testid=wb_no-results]');
    preselectArea = Selector('[data-testid=enablementArea]');
    expandArea = Selector('[data-testid=enablement-area-container]');
    noCommandHistoryTitle = Selector('[data-testid=wb_no-results__title]');
    noCommandHistoryText = Selector('[data-testid=wb_no-results__summary]');
    scrolledEnablementArea = Selector('[data-testid=enablement-area__page]');
    enablementAreaPaginationPopover = Selector('[data-testid=enablement-area__pagination-popover]');
    enablementAreaTreeView = Selector('[data-testid=enablementArea-treeView]');
    customPluginsViewType = Selector('[data-test-subj*=clients-list]');
    commandExecutionResult = Selector('[data-testid=query-common-result]');
    commandExecutionResultFailed = Selector('[data-testid=cli-output-response-fail]');
    chartViewTypeOptionSelected = Selector('[data-testid=view-type-selected-Plugin-redistimeseries__redistimeseries-chart]');
    runButtonToolTip = Selector('[data-testid=run-query-tooltip]');
    //MONACO ELEMENTS
    monacoCommandDetails = Selector('div.suggest-details-container');
    monacoCloseCommandDetails = Selector('span.codicon-close');
    monacoSuggestion = Selector('span.monaco-icon-name-container');
    monacoContextMenu = Selector('div.shadow-root-host').shadowRoot();
    monacoShortcutInput = Selector('input.input');
    monacoSuggestionOption = Selector('div.monaco-list-row');
    monacoHintWithArguments = Selector('[widgetid="editor.widget.parameterHintsWidget"]');
    monacoCommandIndicator = Selector('div.monaco-glyph-run-command');
    monacoWidget = Selector('[data-testid=monaco-widget]');
    nonRedisEditorResizeBottom = Selector('.t_resize-bottom');
    nonRedisEditorResizeTop = Selector('.t_resize-top');
    //OPTIONS
    selectViewType = Selector('[data-testid=select-view-type]');
    textViewTypeOption = Selector('[data-test-subj^=view-type-option-Text]');
    tableViewTypeOption = Selector('[data-test-subj^=view-type-option-Plugin]');
    graphViewTypeOption = Selector('[data-test-subj^=view-type-option-Plugin-graph]');

    /**
     * Get card container by command
     * @param command The command
     */
    async getCardContainerByCommand(command: string): Promise<Selector> {
        return this.queryCardCommand.withExactText(command).parent('[data-testid^="query-card-container-"]');
    }

    //Select Text view option in Workbench results
    async selectViewTypeText(): Promise<void> {
        await t.click(this.selectViewType);
        await t.click(this.textViewTypeOption);
    }

    //Select Table view option in Workbench results
    async selectViewTypeTable(): Promise<void> {
        await t.click(this.selectViewType);
        await t.click(this.tableViewTypeOption);
    }

    //Select view option in Workbench results
    async selectViewTypeGraph(): Promise<void> {
        await t.click(this.selectViewType);
        await t.click(this.graphViewTypeOption);
    }

    /**
     * Send a command in Workbench
     * @param command The command
     * @param speed The speed in seconds. Default is 1
     * @param paste
     */
    async sendCommandInWorkbench(command: string, speed = 1, paste = true): Promise<void> {
        await t.typeText(this.queryInput, command, { replace: true, speed, paste });
        await t.click(this.submitCommandButton);
    }

    /**
     * Send commands array in Workbench page
     * @param commands The array of commands to send
     */
    async sendCommandsArrayInWorkbench(commands: string[]): Promise<void> {
        for (const command of commands) {
            await this.sendCommandInWorkbench(command);
        }
    }

    /**
     * Send commands array in Workbench page
     * @param command The array of commands to send
     * @param result The array of commands to send
     */
    async checkWorkbenchCommandResult(command: string, result: string): Promise<void> {
        //Compare the command with executed command
        const actualCommand = await this.queryCardContainer.nth(0).find(this.cssQueryCardCommand).textContent;
        await t.expect(actualCommand).eql(command);
        //Compare the command result with executed command
        const actualCommandResult = await this.queryCardContainer.nth(0).find(this.cssQueryCardCommandResult).textContent;
        await t.expect(actualCommandResult).eql(result);
    }
}
