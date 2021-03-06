import { Route, MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import * as actions from '../../../redux/sources/actions';
import RedirectNotAdmin from '../../../components/RedirectNotAdmin/RedirectNotAdmin';
import { routes, replaceRouteId } from '../../../Routes';

describe('RedirectNotAdmin', () => {
    let initialStore;
    let initialEntry;
    let mockStore;

    const wasRedirectedToRoot = (wrapper) => wrapper.find(MemoryRouter).instance().history.location.pathname === routes.sources.path;

    beforeEach(() => {
        initialEntry = [replaceRouteId(routes.sourcesRemove.path, '1')];

        mockStore = configureStore();

        actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'ADD_MESSAGE' }));
    });

    it('Renders null if user is admin', () => {
        initialStore = mockStore({ user: { isOrgAdmin: true } });

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourcesRemove.path} render={ (...args) => <RedirectNotAdmin { ...args } /> } />,
            initialStore,
            initialEntry
        ));

        expect(wrapper.html()).toEqual('');
    });

    it('Renders null if app does not if user is admin (undefined)', () => {
        initialStore = mockStore({ user: { isOrgAdmin: undefined } });

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourcesRemove.path} render={ (...args) => <RedirectNotAdmin { ...args } /> } />,
            initialStore,
            initialEntry
        ));

        expect(actions.addMessage).not.toHaveBeenCalled();
        expect(wasRedirectedToRoot(wrapper)).toEqual(false);
        expect(wrapper.html()).toEqual('');
    });

    it('Renders redirect and creates message if user is not admin', async () => {
        let wrapper;

        initialStore = mockStore({ user: { isOrgAdmin: false } });

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourcesRemove.path} render={ (...args) => <RedirectNotAdmin { ...args } /> } />,
                initialStore,
                initialEntry
            ));
        });

        expect(actions.addMessage).toHaveBeenCalled();
        expect(actions.addMessage).toHaveBeenCalledWith(
            expect.any(String),
            'danger',
            expect.any(String)
        );

        expect(wasRedirectedToRoot(wrapper)).toEqual(true);
    });
});
