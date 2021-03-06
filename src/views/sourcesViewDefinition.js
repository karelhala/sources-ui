export const sourcesColumns = (intl, notSortable = false) => ([{
    title: intl.formatMessage({
        id: 'sources.name',
        defaultMessage: 'Name'
    }),
    value: 'name',
    formatter: 'nameFormatter',
    sortable: !notSortable
}, {
    hidden: true,
    value: 'source_type_id',
    formatter: 'sourceTypeIconFormatter'
}, {
    title: intl.formatMessage({
        id: 'sources.type',
        defaultMessage: 'Type'
    }),
    value: 'source_type_id',
    formatter: 'sourceTypeFormatter'
}, {
    title: intl.formatMessage({
        id: 'sources.application',
        defaultMessage: 'Application'
    }),
    value: 'applications',
    formatter: 'applicationFormatter'
}, {
    title: intl.formatMessage({
        id: 'sources.addedDate',
        defaultMessage: 'Date added'
    }),
    value: 'created_at',
    formatter: 'dateFormatter',
    sortable: !notSortable
}, {
    hidden: true,
    value: 'imported',
    formatter: 'importedFormatter'
}, {
    title: intl.formatMessage({
        id: 'sources.status',
        defaultMessage: 'Status'
    }),
    value: 'availability_status',
    formatter: 'availabilityFormatter',
    sortable: !notSortable
}]);

const KEBAB_COLUMN = 1;
const COUNT_OF_COLUMNS = sourcesColumns({ formatMessage: () => '' }).length;

export const COLUMN_COUNT = COUNT_OF_COLUMNS + KEBAB_COLUMN;
