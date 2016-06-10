'use strict';

var entryFactory = require('../../../factory/EntryFactory');

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isAssignable = CmmnElementHelper.isAssignable,
    isFormSupported = CmmnElementHelper.isFormSupported;


module.exports = function(group, element) {

  if (isFormSupported(element)) {

    // Form Key
    group.entries.push(entryFactory.textField({
      id : 'formKey',
      description : 'Form Key of the Human Task',
      label : 'Form Key',
      modelProperty : 'formKey',
      reference: 'definitionRef'
    }));
  }

  if (isAssignable(element)) {

    // Assignee
    group.entries.push(entryFactory.textField({
      id : 'assignee',
      description : 'Assignee of the Human Task',
      label : 'Assignee',
      modelProperty : 'assignee',
      reference: 'definitionRef'
    }));

    // Candidate Users
    group.entries.push(entryFactory.textField({
      id : 'candidateUsers',
      description : 'A list of candidates for this Human Task',
      label : 'Candidate Users',
      modelProperty : 'candidateUsers',
      reference: 'definitionRef'
    }));

    // Candidate Groups
    group.entries.push(entryFactory.textField({
      id : 'candidateGroups',
      description : 'A list of candidate groups for this Human Task',
      label : 'Candidate Groups',
      modelProperty : 'candidateGroups',
      reference: 'definitionRef'
    }));

    // Due Date
    group.entries.push(entryFactory.textField({
      id : 'dueDate',
      description : 'The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)',
      label : 'Due Date',
      modelProperty : 'dueDate',
      reference: 'definitionRef'
    }));

    // FollowUp Date
    group.entries.push(entryFactory.textField({
      id : 'followUpDate',
      description : 'The follow up date as an EL expression (e.g. ${someDate} or an ' +
                    'ISO date (e.g. 2015-06-26T09:54:00)',
      label : 'Follow Up Date',
      modelProperty : 'followUpDate',
      reference: 'definitionRef'
    }));

    // priority
    group.entries.push(entryFactory.textField({
      id : 'priority',
      description : 'Priority of this Human Task',
      label : 'Priority',
      modelProperty : 'priority',
      reference: 'definitionRef'
    }));
  }
};
