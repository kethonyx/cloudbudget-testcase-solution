import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOpportunitiesServer from '@salesforce/apex/OpportunityReportPageController.getOpportunitiesServer';
import deleteOpportunity from '@salesforce/apex/OpportunityReportPageController.deleteOpportunity';

const ACTIONS = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

export default class OpportunityReport extends NavigationMixin(LightningElement) {
    @track opportunities = [];

    budgetYear = '2024';
    stage = 'all';
    closeDate = '';
    sortBy = 'Name';
    sortDirection = 'asc';
    showSpinner = false;

    stageOptions = [
        { label: 'All Stages', value: 'all' },
        { label: 'Prospecting', value: 'Prospecting' },
        { label: 'Qualification', value: 'Qualification' },
        { label: 'Needs Analysis', value: 'Needs Analysis' },
        { label: 'Closed Won', value: 'Closed Won' },
        { label: 'Closed Lost', value: 'Closed Lost' }
    ];

    columns = [
        { label: 'Name', fieldName: 'Name', sortable: true },
        { label: 'Fiscal Year', fieldName: 'FiscalYear', sortable: true },
        { label: 'Amount', fieldName: 'Amount', type: 'currency', sortable: true },
        { label: 'Stage', fieldName: 'StageName', sortable: true },
        { label: 'Description', fieldName: 'Description', sortable: true },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date', sortable: true },
        {
            type: 'action',
            typeAttributes: { rowActions: ACTIONS }
        }
    ];

    get yearOptions() {
        const currentYear = new Date().getFullYear();
        const options = [{ label: 'All Years', value: 'all' }];

        for (let i = -2; i <= 2; i++) {
            const year = (currentYear + i).toString();
            options.push({ label: year, value: year });
        }

        return options;
    }

    get totalAmount() {
        return this.opportunities.reduce((sum, opp) => {
            return sum + (opp.Amount || 0);
        }, 0);
    }

    connectedCallback() {
        this.doInit();
    }

    handleChange(event) {
        this.budgetYear = event.detail.value;
        this.doInit();
    }

    handleStageChange(event) {
        this.stage = event.detail.value;
        this.doInit();
    }

    handleCloseDateChange(event) {
        this.closeDate = event.detail.value;
        this.doInit();
    }

    handleSort(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.doInit();
    }

    async handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'edit') {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: row.Id,
                    objectApiName: 'Opportunity',
                    actionName: 'edit'
                }
            });
        } else if (actionName === 'delete') {
            try {
                await deleteOpportunity({ opportunityId: row.Id });

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Opportunity deleted',
                        variant: 'success'
                    })
                );

                await this.doInit();
            } catch (e) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: e.body?.message || e.message,
                        variant: 'error'
                    })
                );
            }
        }
    }

    handleExport() {
    const headers = ['Name', 'Fiscal Year', 'Amount', 'Stage', 'Description', 'Close Date'];

    const rows = this.opportunities.map(r => [
        r.Name,
        r.FiscalYear,
        r.Amount,
        r.StageName,
        r.Description,
        r.CloseDate
    ]);

    const csvContent = [headers, ...rows]
        .map(e => e.join(','))
        .join('\n');

    const element = document.createElement('a');
    element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    element.download = 'opportunity-report.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    }

    async doInit() {
        try {
            this.showSpinner = true;

            const params = {
                budgetYear: this.budgetYear,
                stage: this.stage,
                closeDate: this.closeDate,
                sortBy: this.sortBy,
                sortDirection: this.sortDirection
            };

            this.opportunities = await getOpportunitiesServer({ params });
            console.log('Loaded opportunities:', JSON.stringify(this.opportunities));
        } catch (e) {
            console.error('doInit error:', JSON.stringify(e));
            console.error('doInit raw error:', e);
        } finally {
            this.showSpinner = false;
        }
    }
}