public with sharing class OpportunityReportPageController {

    @AuraEnabled
    public static List<Opportunity> getOpportunitiesServer(Map<String, String> params) {
        String budgetYear = params.get('budgetYear');
        String stage = params.get('stage');
        String closeDate = params.get('closeDate');
        String sortBy = params.get('sortBy');
        String sortDirection = params.get('sortDirection');
        Set<String> allowedFields = new Set<String>{
            'Name','FiscalYear','Amount','StageName','Description','CloseDate'
        };

        if (!allowedFields.contains(sortBy)) {
             sortBy = 'Name';
        }
        String s = 'SELECT Id, Name, FiscalYear, Amount, StageName, Description, CloseDate ';
        String f = ' FROM Opportunity';
        String w = ' WHERE Id != NULL ';
        if (String.isBlank(sortBy)) {
            sortBy = 'Name';
        }

        if (String.isBlank(sortDirection) || sortDirection.toLowerCase() != 'desc') {
            sortDirection = 'ASC';
        } else {
            sortDirection = 'DESC';
        }

        String o = ' ORDER BY ' + sortBy + ' ' + sortDirection + ' ';
        if (!String.isEmpty(budgetYear) && budgetYear != 'all') w += ' AND FiscalYear = ' + Integer.valueOf(budgetYear) + ' ';
        if (!String.isEmpty(stage) && stage != 'all') w += ' AND StageName = \'' + stage + '\' ';
        if(!String.isEmpty(closeDate)) w += ' AND CloseDate = ' + closeDate + ' '; 
        return Database.query(s + f + w + o);
    }

    @AuraEnabled
    public static void deleteOpportunity(Id opportunityId) {
        delete [SELECT Id FROM Opportunity WHERE Id = :opportunityId LIMIT 1];
}

}