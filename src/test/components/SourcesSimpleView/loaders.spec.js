import React from 'react';
import { mount } from 'enzyme';
import { RowWrapper } from '@patternfly/react-table';
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';

import { PlaceHolderTable, RowWrapperLoader } from '../../../components/SourcesSimpleView/loaders';
import { COLUMN_COUNT } from '../../../views/sourcesViewDefinition';

describe('loaders', () => {
    describe('PlaceholderTable', () => {
        it('renders correctly', () => {
            const wrapper = mount(<PlaceHolderTable />);

            expect(wrapper.find('table').length).toEqual(1);
            expect(wrapper.find(RowLoader).length).toEqual(12);
        });
    });

    describe('RowWrapperLoader', () => {
        const row = {
            cells: ['CellText']
        };

        it('renders loader when item is deleting', () => {
            const wrapper = mount(<RowWrapperLoader row={{ ...row, isDeleting: true }} />);

            expect(wrapper.find(RowLoader).length).toEqual(1);
            expect(wrapper.find(RowWrapper).length).toEqual(0);
            expect(wrapper.find('td').props().colSpan).toEqual(COLUMN_COUNT);
        });

        it('renders rowWrapper when item is not deleting', () => {
            const wrapper = mount(<RowWrapperLoader row={row} />);

            expect(wrapper.find(RowLoader).length).toEqual(0);
            expect(wrapper.find(RowWrapper).length).toEqual(1);
        });
    });
});
