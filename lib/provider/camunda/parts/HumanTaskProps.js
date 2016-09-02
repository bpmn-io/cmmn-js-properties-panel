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
      label : 'Form Key',
      modelProperty : 'formKey',
      reference: 'definitionRef'
    }));
  }

  if (isAssignable(element)) {

    // Assignee
    group.entries.push(entryFactory.textField({
      id : 'assignee',
      label : 'Assignee',
      modelProperty : 'assignee',
      reference: 'definitionRef'
    }));

    // Candidate Users
    group.entries.push(entryFactory.textField({
      id : 'candidateUsers',
      label : 'Candidate Users',
      modelProperty : 'candidateUsers',
      reference: 'definitionRef'
    }));

    // Candidate Groups
    group.entries.push(entryFactory.textField({
      id : 'candidateGroups',
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
      label : 'Priority',
      modelProperty : 'priority',
      reference: 'definitionRef'
    }));
  }
};
