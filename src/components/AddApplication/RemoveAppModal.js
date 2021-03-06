import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { Split } from '@patternfly/react-core/dist/js/layouts/Split/Split';
import { SplitItem } from '@patternfly/react-core/dist/js/layouts/Split/SplitItem';
import { Stack } from '@patternfly/react-core/dist/js/layouts/Stack/Stack';
import { Modal } from '@patternfly/react-core/dist/js/components/Modal/Modal';

import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';

import { removeApplication } from '../../redux/sources/actions';
import { useSource } from '../../hooks/useSource';

const RemoveAppModal = ({ app, onCancel }) => {
    const intl = useIntl();

    const appTypes = useSelector(({ sources }) => sources.appTypes);
    const source = useSource();

    const dispatch = useDispatch();

    const dependentApps = app.dependent_applications.map(appName => {
        const appType = appTypes.find(({ name }) => name === appName);

        return appType ? app.sourceAppsNames.includes(appType.display_name) ? appType.display_name : undefined : undefined;
    }).filter(x => x);

    const onSubmit = () => {
        const titleSuccess = intl.formatMessage({
            id: 'sources.removeAppWarning',
            defaultMessage: `{ name } was removed from this source.`
        },
        {
            name: app.display_name
        });
        const titleError = intl.formatMessage({
            id: 'sources.removeAppError',
            defaultMessage: `Removing of { name } application from this source was unsuccessful.`
        }, {
            name: app.display_name
        });
        onCancel();
        return dispatch(removeApplication(app.id, source.id, titleSuccess, titleError));
    };

    return (
        <Modal
            className="ins-c-sources__dialog--warning"
            title={`Remove ${app.display_name} application`}
            isOpen={true}
            isSmall
            onClose={onCancel}
            isFooterLeftAligned
            actions={[
                <Button
                    id="deleteSubmit" key="submit" variant="danger" type="button" onClick={ onSubmit }
                >
                    <FormattedMessage
                        id="sources.remove"
                        defaultMessage="Remove"
                    />
                </Button>,
                <Button id="deleteCancel" key="cancel" variant="link" type="button" onClick={ onCancel }>
                    <FormattedMessage
                        id="sources.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>
            ]}
        >
            <Split gutter="md">
                <SplitItem><ExclamationTriangleIcon size="xl" className="ins-m-alert ins-c-source__delete-icon" /></SplitItem>
                <SplitItem isFilled>
                    <Stack gutter="md">
                        <TextContent>
                            <Text component={TextVariants.p}>
                                <FormattedMessage
                                    id="sources.deleteAppWarning"
                                    defaultMessage={`Are you sure to remove { appName } from this source?`}
                                    values={{
                                        appName: app.display_name
                                    }}
                                />
                            </Text>
                            {dependentApps.length > 0 && <Text component={TextVariants.p}>
                                <FormattedMessage
                                    id="sources.deleteAppDetails"
                                    defaultMessage={`This change will affect these applications: { apps }.`}
                                    values={{
                                        apps: dependentApps
                                    }}
                                />
                            </Text>}
                        </TextContent>
                    </Stack>
                </SplitItem>
            </Split>
        </Modal>
    );
};

RemoveAppModal.propTypes = {
    app: PropTypes.shape({
        id: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired,
        dependent_applications: PropTypes.arrayOf(PropTypes.string),
        sourceAppsNames: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    onCancel: PropTypes.func.isRequired
};

export default RemoveAppModal;
