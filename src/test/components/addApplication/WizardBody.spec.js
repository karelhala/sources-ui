import { Wizard } from '@patternfly/react-core';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import WizardBodyAttach from '../../../components/AddApplication/WizardBody';

const Step = () => <div>Ahoooj</div>;

describe('AddApplication wizard - ErroredStep', () => {
    let initialProps;
    let goToSources;

    beforeEach(() => {
        goToSources = jest.fn();

        initialProps = {
            goToSources,
            step: <Step />
        };
    });

    afterEach(() => {
        goToSources.mockReset();
    });

    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(<WizardBodyAttach {...initialProps}/>));

        expect(wrapper.find(Wizard)).toHaveLength(1);
        expect(wrapper.find(Step)).toHaveLength(1);
    });
});
