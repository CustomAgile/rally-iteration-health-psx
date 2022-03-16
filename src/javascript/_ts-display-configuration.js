Ext.define('Rally.technicalservices.healthConfiguration',{
    mixins: {
        observable: 'Ext.util.Observable'
    },
    logger: new Rally.technicalservices.Logger(),
    /**
     * Configurations set by the app
     */
    usePoints: true,
    appId: undefined,
    showDateForHalfAcceptanceRatio: false,
    skipZeroForEstimationRatio: false,
    context: undefined,
    useLocalTime: true,
    showSayDo: false,

    /**
     * Colors for Cell Renderers
     */
    red: '#ff9999',
    yellow: '#ffffcc',
    green: '#ccffcc',
    grey: '#e6e6e6',
    benchmarkGreen: 80,
    benchmarkField: '__ratioEstimated',
    defaultRange: { red: 0, yellow: 60, green: 90, direction: 'red,yellow,green' },

    /**
     * Display settings for column names, whether or not to display columns,
     * tooltips and default ranges
     */
    displaySettings: {
        Name: {
            displayName: 'Iteration',
            display: true,
            colAlign: 'left'
        },
        StartDate: {
            display: true,
            displayName: 'Start Date',
            colAlign: 'center'
        },
        EndDate: {
            display: true,
            displayName: 'End Date',
            colAlign: 'center'
        },
        __days: {
            display: true,
            displayName: '# Days',
            tooltip: "The number of full days in the iteration " +
            "(Excluding weekends)"
        },

        __ratioEstimated: {
            display: true,
            displayName: 'Percent Estimated',
            range: { red: 0, yellow: 75, green: 95, direction: 'red,yellow,green'},
            tooltip: "<h1>Description</h1>" +
            "Represents the ratio of work items (stories and defects) that have estimates." +
            "<h1>How it is calculated</h1>" +
            "Divide the number of work items (stories and defects) in the iteration that have a plan " +
            "estimate that is not null by the total number of items in the iteration multiplied by 100. " +
            "<h1>Coaching Tip</h1>" +
            "If there is a very high percentage or stories without estimates, other measures will not " +
            "be meaningful.  This is really only useful for the beginning of an iteration, and perhaps " +
            "for an iteration in early flight, but not for an iteration that has ended.  The idea is to " +
            "catch this early in an iteration so other charts/graphs etc are useful for teams.  A good " +
            "practice is to have a ready backlog as and entrance criteria to an iteration planning session, " +
            "a ready backlog means three things, sized, ranked, and stories are elaborated sufficiently with " +
            "acceptance criteria to enable conversation and confirmation during planning."
        },
        __ratioInProgress: {
            display: true,
            range: { green: 0, yellow: 35, red: 50, direction: 'green,yellow,red'},
            displayName: 'Average Daily In-Progress Percentage',
            tooltip:  "<h1>Description</h1>" +
            "This is an indication of how much work is in progress (WIP).  It is the ratio of the average of " +
            "the work items in the in-Progress state on a daily basis. " +
            "<h1>How it is calculated</h1>" +
            "Divide the plan estimate of all the work items in the 'in-progress' state by the total plan estimate " +
            "of the work items in the iteration, divided by the number of days.  If the iteration is in-flight, we'll " +
            "divide by the number of days so far.   If analysis type is set to counts, the calculation is based on the " +
            "count of the work items, not the plan estimate of the work items." +
            "<h1>Coaching Tip</h1>" +
            "A high percentage here would mean that there is a high degree of daily WIP on average.  Keeping WIP small, " +
            "reduces context switching and helps team focus on the most important items to reach acceptance."
        },
        __halfAcceptedRatio: {
            display: false,
            range: { green: 0, yellow: 65, red: 90, direction: 'green,yellow,red'},
            displayName: 'Acceptance Rate Score',
            tooltip: "<h1>Description</h1>" +
            "This is an indication of how well teams are doing with accepting work throughout the iteration.  A high " +
            "percentage would mean that half of the work is being accepted near the end of the iteration.  100% would mean " +
            "that on the last day of the iteration, the team has accepted at least 1/2 of the committed work.  For a 10 day " +
            "iteration, for example, 25% would mean that 1/2 of the committed work was accepted before day 3." +
            "<h1>How it is calculated</h1>" +
            "Find the percentage of plan estimate points that are accepted at the end of every day of the sprint and determine " +
            "what part of the sprint that number passes 50%.  If analysis type is set to counts, the calculation is based on " +
            "the count of the work items, not the plan estimate of the work items.  Should the percentage of points accepted " +
            "drop below 50%, the point at which 50% acceptance is achieved is reset, until 50% is once again achieved." +
            "<h1>Coaching Tip</h1>" +
            "Common causes of work being accepted late are:  Product Owner is absent or at least not actively participating with the " +
            "team on a daily basis.  Stories do not have clear acceptance criteria.  Teams lack a clear definition of done for stories, " +
            "to name a few.  A team that tends to accept work items late in the iteration may risk meeting commitment. "
        },
        __halfAcceptedDate: {
            display: false,
            displayName: "Acceptance Rate Score Date"
        },
        __endCompletionRatio: {
            display: true,
            range: { red: 0, yellow: 95, green: 100, direction: 'red,yellow,green'},
            displayName: 'Last Day Completion Ratio',
            tooltip: "<h1>Description</h1>" +
            "Represent the ratio of work completed by iteration end.  A low percentage migh imply that there is work planned into an " +
            "iteration that was left in a schedule state lower than completed." +
            "<h1>How it is Calculated</h1>" +
            "Divide the plan estimates of the work items in the iteration that are in a schedule state that is Completed " +
            "or higher at the end of the last day of the iteration by the total plan estimate of all work items in the iteration. " +
            "If analysis type is set to 'counts', the calculation is based on the count of the work items, not the plan estimate " +
            "of the work items."
        },
        __endIncompletionRatio: {
            display: false,
            range: { green: 0, yellow: 5, red: 10, direction: 'green,yellow,red'},
            displayName: "Last Day Incompletion Ratio"
        },
        __endAcceptanceRatio: {
            display: true,
            displayName: 'Last Day Acceptance Ratio',
            range: { red: 0, yellow: 80, green: 95, direction: 'red,yellow,green'},
            tooltip:  "<h1>Description</h1>" +
            "Indicates whether teams met their commitment, assuming work items have not been removed from the iteration. " +
            "<h1>How it is calculated</h1>" +
            "Divide the plan estimates of the work items in the iteration that were accepted on the last day of the iteration " +
            "by the total plan estimate of all work items in the iteration.  If analysis type is set to 'counts', the calculation " +
            "is based on the number of work items, not the plan estimate of the work items.",
                health_ratio_in_progress: "<h1>Description</h1>" +
            "This is an indication of how much work is in progress (WIP).  It is the ratio of the average of " +
            "the work items in the in-Progress state on a daily basis. " +
            "<h1>How it is calculated</h1>" +
            "Divide the plan estimate of all the work items in the 'in-progress' state by the total plan estimate " +
            "of the work items in the iteration, divided by the number of days.  If the iteration is in-flight, we'll " +
            "divide by the number of days so far.   If analysis type is set to �counts�, the calculation is based on the " +
            "count of the work items, not the plan estimate of the work items." +
            "<h1>Coaching Tip</h1>" +
            "A high percentage here would mean that there is a high degree of daily WIP on average.  Keeping WIP small, " +
            "reduces context switching and helps team focus on the most important items to reach acceptance."
        },
        __scopeChurn: {
            display: true,
            displayName: 'Scope Churn',
            tooltip:  "<h1>Description</h1>" +
            "Churn is a measure of the change in the iteration's scope." +
            "Churn Direction is an indicator of the general direction of scope change.  Churn is defined as a standard deviation, which " +
            "is always zero or positive, so this added indicator provides an indication of whether scope tended to be added or removed " +
            "<h1>How it is calculated</h1>" +
            "It is defined as the standard deviation of the total scheduled into the sprint divided by the average daily total." +
            "The direction is determined by examining every day's change from the day before and adding or subtracting the delta to determine " +
            "whether scope has been added more often than subtracted. (The first day of the iteration is excluded from this calculation.)"
        },
        __taskChurn: {
            display: true,
            displayName: 'Percentage of Task Removal at Iteration End',
            tooltip: "<h1>Description</h1>" +
            "An additional metric indicating when tasks have been added or removed on the last day of the iteration.  If a signivicant" +
            "percentage of tasks are removed, it could be an indicator that the team is moving committed work items to another iteration." +
            "<h1>How it is calculated</h1>" +
            "The number of estimated hours for the tasks scheduled in the iteration on the last day are subtracted from the total estimated " +
            "hours of tasks scheduled on the next-to-last day, then divided by the next-to-last-day totals to create a percentage.  Note " +
            "that this is calculated from the <b>estimates</b> of all the tasks, not the hours remaining to-do"
        },
        __velocityVariance: {
            display: true,
            displayName: 'Velocity Variance',
            range: { green: 0, yellow: 13, red: 20, direction: 'green,yellow,red'},
            tooltip: "<h1>Description</h1>" +
            "Velocity Variance is the % variance of the velocity from the average of a number of previous sprints (e.g. 3). If there is" +
            " only data from less than that number, then that data will be used.  Otherwise the velocity variance will show as No Data.  " +
            "<h1>How it is calculated</h1>" +
            "The velocity used in this calculation is the current velocity, which is calculated by adding all stories associated with " +
            "the iteration as of the current date"
        },
        __cycleTime: {
            display: true,
            displayName: 'Avg Cycle Time',
            range: { green: 0, yellow: 4, red: 6, direction: 'green,yellow,red'},
            tooltip: "<h1>Description</h1>" +
            "Cycle Time in this report is the average number of days betweens starting and finishing a story in the sprint." +
            "<h1>How it is calculated</h1>" +
            "The displayed result is the number of days between the In Progress Date and the Accepted Date."
        },
        __sayDoRatioData: {
            display: false,
            displayName: 'Say Do Ratio',
            range: { green: 0, yellow: 0, red: 0, direction: 'red,yellow,green'},
            tooltip: "<h1>Description</h1>" +
            "Say Do Ratio is calculated from the items associated on the first day of the sprint compared to the status " +
            "of the same items on the last day of the sprint." +
            "<h1>How it is calculated</h1>" +
            "If a story or defect is assigned to the sprint on the first day of the sprint, then its size or count is " +
            "added to the starting total.  If a story or defect from that group only is still in the sprint at the last day " + 
            "AND has been accepted, then the points/count <em>from the start</em> is added to the ending total.  The Say/Do Ratio is the division of " +
            "end value by start value.  Items can be counted in the start but not the end by not being (at least) accepted or " +
            "by not being in the sprint any more on the last day.  Items not counted at all are ones that are in the sprint on " + 
            "the last day but were not added to the sprint until after the first day."
        }
    },

    constructor: function(config){
        Ext.apply(this, config);
        this.mixins.observable.constructor.call(this, config);

        this.addEvents(
            'rangechanged',
            'ready'
        );

        //Get settings and preferences here
        if (this.appId){
            Rally.technicalservices.WsapiToolbox.fetchPreferences(this.appId).then({
                scope: this,
                success: function(prefs){
                    if ( prefs && prefs['rally-tech-services-ranges'] ) {
                        var savedRanges = Ext.JSON.decode(prefs['rally-tech-services-ranges']);
                        _.each(savedRanges,function(value, key){
                            this.displaySettings[key].range = value;
                        }, this);
                    }
                    this.fireEvent('ready');
                }
            });
        } else {
            this.fireEvent('ready');
        }

    },
    getRenderer: function(field,v,m,r,r_idx, c_idx){

        var useLocalTime = Rally.getApp().getSetting('useLocalTime');
        
        if (field == 'StartDate' || field == 'EndDate'){
            if ( useLocalTime ) {
                field = 'shortDate';
            } else {
                field = 'longDate';
            }
        }

        if (this.renderers[field]){
            return this.renderers[field];
        }
        return this.renderers.defaultRenderer;
    },
    renderers: {
        defaultRenderer: function(v,m,r){
            if (!isNaN(v)){
                m.style="text-align:right;";
            }
            return v;
        },
        __days: function(v,m,r){
            m.style = "padding-right:7px;text-align:right;";
            return v;
        },
        
        longDate: function(value, m) {
            if (value && new Date(value) !== 'Invalid Date'){
                m.style = "text-align:center;";
                
                value = moment(value);
                var wks = Rally.getApp().getContext().getWorkspace();
                var timezone = wks.WorkspaceConfiguration.TimeZone;
                
                return value.tz(timezone).format('YYYY-MMM-DD h:mm a z');
//                value = new Date(value);
//                return Rally.util.DateTime.formatWithDefaultDateTime(value, Rally.getApp().getContext());
            }
            return "";
        },
        
        shortDate: function(value, m) {

             if (value && new Date(value) !== 'Invalid Date'){
                value = new Date(value);
                m.style = "text-align:center;";
                return Rally.util.DateTime.formatWithDefault(value, this.context);
            }
            return "";
        },
        
        __ratioEstimated: function(value,metaData,record){
            if (!this.usePoints){
                return "N/A";
            }

            if ( value < 0 || value > 1) {
                metaData.style = 'padding-right:7px;text-align:right;background-color:' + this.grey;
                return "No Data";
            }
            var percent = parseInt( 100 * value, 10 );
            var ranges = this.displaySettings.__ratioEstimated.range || this.defaultRange;

            var color = this.red;
            if ( percent >= ranges.yellow ) {
                color = this.yellow;
            }
            if ( percent >= ranges.green ) {
                color = this.green;
            }

            metaData.style = 'padding-right:7px;text-align:right;background-color:'+color;
            return percent + "%";
        },
        __ratioInProgress: function(value,metaData,record) {
            if (value < 0){
                metaData.style = "text-align:right;background-color: " + this.grey;
                return "No Data";
            }


            var percent = parseInt( 100 * value, 10),
                ranges = this.displaySettings.__ratioInProgress.range,
                color = this.renderers.getRangeColor(percent,record, ranges, this, true);

            if (color){
                metaData.style = "padding-right:7px;text-align:right;background-color: " + color;
            }
            return percent + "%";
        },
        __halfAcceptedRatio: function(value,metaData,record) {
            var ranges = this.displaySettings.__halfAcceptedRatio.range;
            var color = this.green;

            if ( value < 0 ) {
                metaData.style = "padding-right:7px;text-align:right;background-color: " + this.grey;
                return "No Data";
            }
            var percent = parseInt( 100 * value, 10),
                text = "Never";

            if (percent < 200) {
                if (this.showDateForHalfAcceptanceRatio){
                    var date = record.get('__halfAcceptedDate');
                    if (!isNaN(Date.parse(date))){
                        text = Ext.String.format('{0}% ({1})', percent,this.renderers.shortDate(date, metaData));
                    }
                } else {
                    text = Ext.String.format('{0}%',percent);
                }
            }
            color = this.renderers.getRangeColor(percent,record, ranges, this, true);
            metaData.style = "padding-right:7px;text-align:right;background-color: " + color;
            return text;
        },
        __sayDoRatioData: function(value,metaData,record) {
            var ranges = this.displaySettings.__sayDoRatioData.range;
            console.log('ranges:', ranges);
            
            var color = this.green;

            var field = 'count_ratio';
            if ( this.usePoints ) {
                field = 'size_ratio';
            }
            
            value = record.get('__sayDoRatioData') && record.get('__sayDoRatioData')[field];
            
            if ( Ext.isEmpty(value) ) {
                metaData.style = "padding-right:7px;text-align:right;background-color: " + this.grey;
                return "--";
            }
            if ( value < 0 ) {
                metaData.style = "padding-right:7px;text-align:right;background-color: " + this.grey;
                return "N/A";
            }
            var percent = parseInt( 100 * value, 10),
                text = "Never";

            
            text = Ext.String.format('{0}%',percent);
                
            color = this.renderers.getRangeColor(percent,record, ranges, this, true);
            metaData.style = "padding-right:7px;text-align:right;background-color: " + color;
            return text;
        },
        getRangeColor: function(percent, record, ranges, config, check_grey){
            var should_be_grey = (check_grey && config.renderers.shouldBeGrey(config,record)),
                color_range = ranges.direction.split(',');

            if (should_be_grey){
                return config.grey;
            }

            var color_code = color_range[0];
            Ext.each(color_range, function(c){
                if (percent >= ranges[c]){
                    color_code = c;
                }
            });

            return config[color_code];

        },
        shouldBeGrey: function(config, record){
            var check_percent = record.get(config.benchmarkField) * 100;
            return (check_percent < config.benchmarkGreen && config.usePoints);
        },
        __endCompletionRatio: function(value,metaData,record) {
            if ( value < 0 ) {
                metaData.style = "padding-right:7px;text-align:right;background-color: " + this.grey;
                return "No Data";
            }
            var ranges = this.displaySettings.__endCompletionRatio.range,
                percent = parseInt( 100 * value, 10),
                text = ( percent == 200 ) ? "No Data" : (percent + "%");


            var color = this.renderers.getRangeColor(percent,record,ranges,this,true);

            metaData.style = "text-align:right;background-color: " + color;
            return text;
        },
        __endAcceptanceRatio: function(value,metaData,record) {

            if ( value < 0 ) {
                metaData.style = "padding-right:7px;text-align:right;background-color: " + this.grey;
                return "No Data";
            }
            var percent = parseInt( 100 * value, 10 );
            var text = ( percent == 200 ) ? "No Data" : (percent + "%");
            var ranges = this.displaySettings.__endAcceptanceRatio.range;


            var color = this.renderers.getRangeColor(percent, record, ranges, this, true);

            metaData.style = "padding-right:7px;text-align:right;background-color: " + color;

            return text;
        },
        __scopeChurn: function(value,metaData,record) {

            var color = this.renderers.shouldBeGrey(this,record) ? this.grey : "white";

            var direction = 1,
                icon_string = "";
            if (value != 0){
                direction = value/Math.abs(value);
                var icon = direction < 0 ? "icon-minus" : "icon-plus" ; //"<img src='/slm/mashup/1.11/images/plus.gif' title='up'>";
                icon_string = Ext.String.format('<div class= "control {0}" style:="display:inline;"></div>', icon);
            }

            var percent = parseInt( 100 * Math.abs(value), 10 ),
                text = ( percent < 200 ) ? (percent + "%") : "No Data" ;

            if (percent == 0 || text == "No Data"){
                icon_string = "";
            }

            metaData.style = "padding-right:7px;background-color: " + color;

            if (text == "No Data"){
                return Ext.String.format('<div style="display:inline;text-align:right;float:right;background-color:{0};">{1}</div>{2}',color,text,icon_string);
            }
            return Ext.String.format('<div style="display:inline;width:35px;text-align:right;float:right;background-color:{0};">{1}</div>{2}',color,text,icon_string);
        },
        __taskChurn: function(value,metaData,record) {

            var text = "No Data",
                direction = 0,
                icon_string = "";
            var color = this.renderers.shouldBeGrey(this,record) ? this.grey : "white";
            metaData.style = "padding-right:7px;background-color: " + color;

            if (value == Infinity){
                text = "Infinity";
                return Ext.String.format('<div style="display:inline;text-align:right;float:right;background-color:{0};">{1}</div>{2}',color,text,icon_string);
            }

            if ( value != -2) {
                var percent = parseInt( 100 * Math.abs(value), 10 );
                text = percent + "%";
                if (value != 0){
                    direction = value/Math.abs(value);
                    var icon = direction < 0 ? "icon-minus" : "icon-plus" ; //"<img src='/slm/mashup/1.11/images/plus.gif' title='up'>";
                    icon_string = Ext.String.format('<div class= "control {0}" style:="display:inline;"></div>', icon);
                }
            } else {
                text = "No data";
                return Ext.String.format('<div style="display:inline;text-align:right;float:right;background-color:{0};">{1}</div>{2}',color,text,icon_string);
            }
             return Ext.String.format('<div style="display:inline;width:35px;text-align:right;float:right;background-color:{0};">{1}</div>{2}' ,color, text, icon_string);
        },
        __velocityVariance: function(value, metaData, record){
            if ( value === null ) {
                metaData.style = "padding-right:7px;text-align:right;background-color: " + this.grey;
                return "N/A";
            }
            var percent = parseInt( 100 * value, 10 );
            var text = percent + "%";
            var ranges = this.displaySettings.__velocityVariance.range;

            var color = this.renderers.getRangeColor(Math.abs(percent), record, ranges, this, true);

            metaData.style = "padding-right:7px;text-align:right;background-color: " + color;

            return text;
        },
        __cycleTime: function(value, metaData, record) {
            if ( value === null || value == -2) {
                metaData.style = "padding-right:7px;text-align:right;background-color: " + this.grey;
                return "N/A";
            }
            var days = Ext.util.Format.number( value, "0.##" );
            
            var ranges = this.displaySettings.__cycleTime.range;

            var color = this.renderers.getRangeColor(Math.abs(days), record, ranges, this, true);

            metaData.style = "padding-right:7px;text-align:right;background-color: " + color;

            return days;
        }

    },
    getRangeColors: function(range){
        var colors = range.direction.split(',');
        return colors.slice(-2);
    },
    getRangeLabel: function(range){
        var colors = range.direction.split(',');
        return Ext.String.format('Range ({0})', colors.join('/'));
    },
    setRanges: function(name, range){

        this.displaySettings[name].range = range;

        var ranges = {};
        _.each(_.keys(this.displaySettings), function(key){
            if (this.displaySettings[key].range){
                ranges[key] = this.displaySettings[key].range;
            }
        }, this);

        Rally.data.PreferenceManager.update({
            appID: this.appId,
            settings: {
                'rally-tech-services-ranges': Ext.JSON.encode(ranges)
            },
            scope: this,
            success: function(updatedRecords, notUpdatedRecords) {
                this.logger.log("Successfully saved preference 'rally-tech-services-ranges'", updatedRecords, notUpdatedRecords);
            },
            failure: function(){
                this.logger.log('Failed to save ranges');
            }
        });
        this.fireEvent('rangechanged');
    },
    getTooltip: function(name){
        if (this.displaySettings[name]){
            return this.displaySettings[name].tooltip || this.displaySettings[name].displayName || name;
        }
        return name;
    },
    updateSettings: function(settings){
        if (settings.hideTaskMovementColumn === true || settings.hideTaskMovementColumn === "true"){
            this.displaySettings.__taskChurn.display = false;
        } else {
            this.displaySettings.__taskChurn.display = true;
        }
        if (settings.showDateForHalfAcceptanceRatio === true || settings.showDateForHalfAcceptanceRatio === "true"){
            this.showDateForHalfAcceptanceRatio = true;
        } else {
            this.showDateForHalfAcceptanceRatio = false;
        }
        if (settings.showVelocityVariation === true || settings.showVelocityVariation === "true"){
            this.displaySettings.__velocityVariance.display = true;
        } else {
            this.displaySettings.__velocityVariance.display = false;
        }
        
        this.showSayDo = settings.showSayDo || false;
        this.displaySettings.__sayDoRatioData.display = this.showSayDo;
        
        if (settings.showIterationCycleTime != false && settings.showIterationCycleTime != "false" ){
            this.displaySettings.__cycleTime.display = true;
            if ( settings.showIterationCycleTime == "inprogress-to-accepted" ) {
                this.displaySettings.__cycleTime.tooltip = "<h1>Description</h1>" +
                    "Cycle Time in this report is the average number of days betweens starting and finishing a story in the sprint." +
                    "<h1>How it is calculated</h1>" +
                    "The displayed result is the number of days between the In Progress Date and the Accepted Date."
            } else {
                this.displaySettings.__cycleTime.tooltip = "<h1>Description</h1>" +
                    "Cycle Time in this report is the average number of days betweens starting and finishing a story in the sprint." +
                    "<h1>How it is calculated</h1>" +
                    "The displayed result is the number of days between the first time an artifact went into In-Progress and the last " +
                    "time it went into Completed."
            }
        
        } else {
            this.displaySettings.__cycleTime.display = false;
        }
        
    }
});

