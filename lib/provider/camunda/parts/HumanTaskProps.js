'use strict';

var entryFactory = require('../../../factory/EntryFactory');

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isAssignable = CmmnElementHelper.isAssignable,
    isFormSupported = CmmnElementHelper.isFormSupported;


module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, translate) {

  if (isFormSupported(element)) {

    // Form Key
    group.entries.push(entryFactory.textField({
      id : 'formKey',
      label : translate('Form Key'),
      modelProperty : 'formKey',
      reference: 'definitionRef'
    }));
  }

  if (isAssignable(element)) {

    // Assignee
    group.entries.push(entryFactory.textField({
      id : 'assignee',
      label : translate('Assignee'),
      modelProperty : 'assignee',
      reference: 'definitionRef'
    }));

    // Candidate Users
    group.entries.push(entryFactory.textField({
      id : 'candidateUsers',
      label : translate('Candidate Users'),
      modelProperty : 'candidateUsers',
      reference: 'definitionRef'
    }));

    // Candidate Groups
    group.entries.push(entryFactory.textField({
      id : 'candidateGroups',
      label : translate('Candidate Groups'),
      modelProperty : 'candidateGroups',
      reference: 'definitionRef'
    }));

    // Due Date
    group.entries.push(entryFactory.textField({
      id : 'dueDate',
      description : translate('The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)'),
      label : translate('Due Date'),
      modelProperty : 'dueDate',
      reference: 'definitionRef'
    }));

    // FollowUp Date
    group.entries.push(entryFactory.textField({
      id : 'followUpDate',
      description : translate('The follow up date as an EL expression (e.g. ${someDate} or an ' +
                              'ISO date (e.g. 2015-06-26T09:54:00)'),
      label : translate('Follow Up Date'),
      modelProperty : 'followUpDate',
      reference: 'definitionRef'
    }));

    // priority
    group.entries.push(entryFactory.textField({
      id : 'priority',
      label : translate('Priority'),
      modelProperty : 'priority',
      reference: 'definitionRef'
    }));
  }
};
