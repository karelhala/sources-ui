import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../Utilities/testsHelpers';
import PermissionsChecker from '../../components/PermissionsChecker';
import * as actions from '../../redux/user/actions';

describe('PermissionChecker', () => {
    it('load userIsOrgAdmin on mount', async () => {
        // eslint-disable-next-line react/display-name
        const Children = () => <h1>App</h1>;
        actions.loadOrgAdmin = jest.fn().mockImplementation(() => ({ type: 'type' }));

        let wrapper;
        await act(async () => {
            wrapper = mount(componentWrapperIntl(<PermissionsChecker>
                <Children />
            </PermissionsChecker>));
        });

        const TITLE = expect.any(String);
        const DESCRIPTION = expect.any(String);

        expect(wrapper.find(Children)).toHaveLength(1);
        expect(actions.loadOrgAdmin).toHaveBeenCalledWith(
            TITLE,
            DESCRIPTION,
        );
    });
});
