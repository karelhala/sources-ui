import ReactDOMServer from 'react-dom/server';
import {
    formatters,
    defaultFormatter,
    nameFormatter,
    dateFormatter,
    sourceTypeFormatter,
    applicationFormatter,
    importedFormatter,
    formatURL,
    sourceIsOpenShift,
    defaultPort,
    schemaToPort,
    endpointToUrl,
    importsTexts,
    availabilityFormatter,
    getStatusIcon,
    getStatusText,
    getStatusTooltipText,
    formatAvailibilityErrors,
    sourceTypeIconFormatter
} from '../../../components/SourcesSimpleView/formatters';
import { sourceTypesData, OPENSHIFT_ID, AMAZON_ID, OPENSHIFT_INDEX } from '../../sourceTypesData';
import { sourcesDataGraphQl, SOURCE_CATALOGAPP_INDEX, SOURCE_ALL_APS_INDEX, SOURCE_NO_APS_INDEX, SOURCE_ENDPOINT_URL_INDEX } from '../../sourcesData';
import {
    applicationTypesData,
    CATALOG_INDEX,
    TOPOLOGICALINVENTORY_INDEX,
    COSTMANAGEMENET_INDEX,
    COSTMANAGEMENT_APP,
    CATALOG_APP
} from '../../applicationTypesData';
import { Badge, Tooltip, Popover, Bullseye } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import { IntlProvider } from 'react-intl';
import { CheckCircleIcon, TimesCircleIcon, QuestionCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';

describe('formatters', () => {
    describe('formatters', () => {
        it('returns nameFormatter', () => {
            expect(formatters('nameFormatter')).toEqual(nameFormatter);
        });

        it('returns dateFormatter', () => {
            expect(formatters('dateFormatter')).toEqual(dateFormatter);
        });

        it('returns sourceTypeFormatter', () => {
            expect(formatters('sourceTypeFormatter')).toEqual(sourceTypeFormatter);
        });

        it('returns applicationFormatter', () => {
            expect(formatters('applicationFormatter')).toEqual(applicationFormatter);
        });

        it('returns importedFormatter', () => {
            expect(formatters('importedFormatter')).toEqual(importedFormatter);
        });

        it('returns availabilityFormatter', () => {
            expect(formatters('availabilityFormatter')).toEqual(availabilityFormatter);
        });

        it('returns sourceTypeIconFormatter', () => {
            expect(formatters('sourceTypeIconFormatter')).toEqual(sourceTypeIconFormatter);
        });

        it('returns defaultFormatter when non-sense', () => {
            const nonsenseFormatter = 'peknaKravina';
            const value = 'some value';
            expect(formatters(nonsenseFormatter)(value)).toEqual(`undefined ${nonsenseFormatter} formatter of value: ${value}`);
        });
    });

    describe('defaultFormatter', () => {
        it('returns string message', () => {
            const VALUE = 'ahoj';
            const NAME = 'dateFormatter';

            const result = defaultFormatter(NAME)(VALUE);

            expect(result.includes(NAME)).toEqual(true);
            expect(result.includes(VALUE)).toEqual(true);
        });
    });

    describe('sourceIsOpenShift', () => {
        it('returns true when is openshift', () => {
            expect(sourceIsOpenShift({ source_type_id: OPENSHIFT_ID }, sourceTypesData.data)).toEqual(true);
        });

        it('returns false when is not openshift', () => {
            expect(sourceIsOpenShift({ source_type_id: AMAZON_ID }, sourceTypesData.data)).toEqual(false);
        });
    });

    describe('sourceTypeFormatter', () => {
        it('returns product_name (OpenShift)', () => {
            expect(sourceTypeFormatter(OPENSHIFT_ID, undefined, { sourceTypes: sourceTypesData.data })).toEqual(sourceTypesData.data.find(x => x.id === OPENSHIFT_ID).product_name);
        });

        it('returns type when there is no product_name', () => {
            expect(sourceTypeFormatter(OPENSHIFT_ID, undefined, { sourceTypes: [{ ...sourceTypesData.data[OPENSHIFT_INDEX], product_name: undefined }] })).toEqual(OPENSHIFT_ID);
        });

        it('returns empty string when no sourceType', () => {
            expect(sourceTypeFormatter(undefined, undefined, { sourceTypes: sourceTypesData.data })).toEqual('');
        });
    });

    describe('sourceTypeIconFormatter', () => {
        it('returns icon', () => {
            const OPENSHIFT = sourceTypesData.data.find(x => x.id === OPENSHIFT_ID);

            const wrapper = mount(sourceTypeIconFormatter(OPENSHIFT_ID, undefined, { sourceTypes: sourceTypesData.data }));

            const imgProps = wrapper.find('img').props();

            expect(wrapper.find(Bullseye)).toHaveLength(1);
            expect(imgProps.src).toEqual(OPENSHIFT.icon_url);
            expect(imgProps.alt).toEqual(OPENSHIFT.product_name);
        });

        it('returns null when no iconUrl', () => {
            expect(
                sourceTypeIconFormatter(OPENSHIFT_ID, undefined, { sourceTypes: [{ ...sourceTypesData.data[OPENSHIFT_INDEX], icon_url: undefined }] })
            ).toEqual(null);
        });

        it('returns null when no sourceType', () => {
            expect(sourceTypeIconFormatter(undefined, undefined, { sourceTypes: sourceTypesData.data })).toEqual(null);
        });
    });

    describe('dateFormatter', () => {
        it('returns parsed date', () => {
            const wrapper = mount(dateFormatter(sourcesDataGraphQl[0].created_at));

            expect(wrapper.find(DateFormat)).toHaveLength(1);
        });
    });

    describe('nameFormatter', () => {
        it('returns name', () => {
            expect(JSON.stringify(nameFormatter(sourcesDataGraphQl[0].name, sourcesDataGraphQl[0], { sourceTypes: sourceTypesData.data }))
            .includes(sourcesDataGraphQl[0].name))
            .toEqual(true);
        });
    });

    describe('importedFormatter', () => {
        it('returns null when undefined value', () => {
            expect(importedFormatter(undefined)).toEqual(null);
        });

        it('returns only imported badge', () => {
            const wrapper = mount(<IntlProvider>{importedFormatter('value with no text')}</IntlProvider>);

            expect(wrapper.find(Badge)).toHaveLength(1);
            expect(wrapper.find(Tooltip)).toHaveLength(0);
        });

        it('returns imported badge with tooltip', () => {
            const wrapper = mount(<IntlProvider>{importedFormatter('cfme')}</IntlProvider>);

            expect(wrapper.find(Badge)).toHaveLength(1);
            expect(wrapper.find(Tooltip)).toHaveLength(1);
        });
    });

    describe('applicationFormatter', () => {
        it('returns full application list', () => {
            const result = JSON.stringify(applicationFormatter(sourcesDataGraphQl[SOURCE_ALL_APS_INDEX].applications, undefined, { appTypes: applicationTypesData.data }));

            expect(result.includes(applicationTypesData.data[CATALOG_INDEX].display_name)).toEqual(true);
            expect(result.includes(applicationTypesData.data[COSTMANAGEMENET_INDEX].display_name)).toEqual(true);
            expect(result.includes(applicationTypesData.data[TOPOLOGICALINVENTORY_INDEX].display_name)).toEqual(true);
        });

        it('returns empty application list', () => {
            const EMPTY_LIST_PLACEHOLDER = '--';
            const result = JSON.stringify(applicationFormatter(sourcesDataGraphQl[SOURCE_NO_APS_INDEX].applications, undefined, { appTypes: applicationTypesData.data }));

            expect(result.includes(applicationTypesData.data[CATALOG_INDEX].display_name)).toEqual(false);
            expect(result.includes(applicationTypesData.data[COSTMANAGEMENET_INDEX].display_name)).toEqual(false);
            expect(result.includes(applicationTypesData.data[TOPOLOGICALINVENTORY_INDEX].display_name)).toEqual(false);
            expect(result.includes(EMPTY_LIST_PLACEHOLDER)).toEqual(true);
        });

        it('returns application list with one item (catalog)', () => {
            const result = JSON.stringify(applicationFormatter(sourcesDataGraphQl[SOURCE_CATALOGAPP_INDEX].applications, undefined, { appTypes: applicationTypesData.data }));

            expect(result.includes(applicationTypesData.data[CATALOG_INDEX].display_name)).toEqual(true);
            expect(result.includes(applicationTypesData.data[COSTMANAGEMENET_INDEX].display_name)).toEqual(false);
            expect(result.includes(applicationTypesData.data[TOPOLOGICALINVENTORY_INDEX].display_name)).toEqual(false);
        });
    });

    describe('formatURL', () => {
        it('returns URL', () => {
            expect(formatURL(sourcesDataGraphQl[SOURCE_ENDPOINT_URL_INDEX])).toEqual('https://myopenshiftcluster.mycompany.com/');
        });
    });

    describe('defaultPort', () => {
        it('returns default port 80 for HTTP', () => {
            expect(defaultPort('http')).toEqual('80');
        });

        it('returns default port 443 for HTTPs', () => {
            expect(defaultPort('https')).toEqual('443');
        });

        it('returns undefined port 443 for uknown scheme', () => {
            expect(defaultPort('mttp')).toEqual(undefined);
        });
    });

    describe('schemaToPort', () => {
        it('correctly parses port', () => {
            expect(schemaToPort('https', 444)).toEqual(':444');
        });

        it('correctly parses string port', () => {
            expect(schemaToPort('https', '444')).toEqual(':444');
        });

        it('correctly parses default port', () => {
            expect(schemaToPort('https', 443)).toEqual('');
        });

        it('correctly parses undefined port', () => {
            expect(schemaToPort('https', undefined)).toEqual('');
        });
    });

    describe('importsTexts', () => {
        it('returns object for cfme', () => {
            expect(importsTexts('cfme')).toEqual(expect.any(Object));
        });

        it('returns object for CFME', () => {
            expect(importsTexts('CFME')).toEqual(expect.any(Object));
        });

        it('returns default undefined', () => {
            expect(importsTexts('nonsense')).toEqual(undefined);
        });
    });

    describe('endpointToUrl', () => {
        let endpoint;
        const CUSTOM_PORT = 123456789;

        beforeEach(() => {
            endpoint = {
                scheme: 'https',
                port: 443,
                path: '/',
                host: 'my.best.page'
            };
        });

        it('returns undefined when there are no positive values', () => {
            endpoint = {
                scheme: null,
                port: undefined,
                path: false,
                host: ''
            };

            expect(endpointToUrl(endpoint)).toEqual(undefined);
        });

        it('correctly parses URL with default port', () => {
            expect(endpointToUrl(endpoint)).toEqual('https://my.best.page/');
        });

        it('correctly parses URL with custom port', () => {
            expect(endpointToUrl({ ...endpoint, port: CUSTOM_PORT })).toEqual(`https://my.best.page:${CUSTOM_PORT}/`);
        });

        it('correctly parses this specific endpoint', () => {
            endpoint = { id: '123', scheme: 'https', host: 'redhat.com' };

            expect(endpointToUrl(endpoint)).toEqual('https://redhat.com');
        });
    });

    describe('availability status', () => {
        const wrapperWithIntl = (children) => <IntlProvider locale="en">{children}</IntlProvider>;
        const SOURCE = {};
        const APPTYPES = applicationTypesData.data;

        describe('getStatusIcon', () => {
            it('returns OK icon', () => {
                const wrapper = mount(getStatusIcon('available'));

                expect(wrapper.find(CheckCircleIcon)).toHaveLength(1);
            });

            it('returns WARNING icon', () => {
                const wrapper = mount(getStatusIcon('partially_available'));

                expect(wrapper.find(ExclamationTriangleIcon)).toHaveLength(1);
            });

            it('returns DANGER icon', () => {
                const wrapper = mount(getStatusIcon('unavailable'));

                expect(wrapper.find(TimesCircleIcon)).toHaveLength(1);
            });

            it('returns unknown by default', () => {
                const wrapper = mount(getStatusIcon('some nonsense'));

                expect(wrapper.find(QuestionCircleIcon)).toHaveLength(1);
            });
        });

        describe('getStatusText', () => {
            it('returns OK text', () => {
                const wrapper = mount(wrapperWithIntl(getStatusText('available')));

                expect(wrapper.text()).toEqual('OK');
            });

            it('returns WARNING text', () => {
                const wrapper = mount(wrapperWithIntl(getStatusText('partially_available')));

                expect(wrapper.text()).toEqual('Partially available');
            });

            it('returns DANGER text', () => {
                const wrapper = mount(wrapperWithIntl(getStatusText('unavailable')));

                expect(wrapper.text()).toEqual('Unavailable');
            });

            it('returns unknown by default', () => {
                const wrapper = mount(wrapperWithIntl(getStatusText('some nonsense')));

                expect(wrapper.text()).toEqual('Unknown');
            });
        });

        describe('getStatusTooltipText', () => {
            const ERRORMESSAGE = 'some error';
            const ERRORMESSAGE2 = 'different type of error';

            it('returns OK text', () => {
                const wrapper = mount(wrapperWithIntl(getStatusTooltipText('available', SOURCE, APPTYPES)));

                expect(wrapper.text()).toEqual('Everything works fine - all applications are connected.');
            });

            it('returns WARNING text', () => {
                const SOURCE_WITH_ERROR = {
                    applications: [{
                        application_type_id: COSTMANAGEMENT_APP.id,
                        availability_status_error: ERRORMESSAGE,
                        availability_status: 'unavailable'
                    }]
                };

                const wrapper = mount(wrapperWithIntl(getStatusTooltipText('partially_available', SOURCE_WITH_ERROR, APPTYPES)));

                expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
                expect(wrapper.text().includes(COSTMANAGEMENT_APP.display_name)).toEqual(true);
            });

            it('returns DANGER text', () => {
                const SOURCE_WITH_ERRORS = {
                    applications: [{
                        application_type_id: COSTMANAGEMENT_APP.id,
                        availability_status_error: ERRORMESSAGE,
                        availability_status: 'unavailable'
                    }, {
                        availability_status: 'unavailable',
                        application_type_id: CATALOG_APP.id,
                        availability_status_error: ERRORMESSAGE2
                    }]
                };

                const wrapper = mount(wrapperWithIntl(getStatusTooltipText('unavailable', SOURCE_WITH_ERRORS, APPTYPES)));

                expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
                expect(wrapper.text().includes(COSTMANAGEMENT_APP.display_name)).toEqual(true);

                expect(wrapper.text().includes(ERRORMESSAGE2)).toEqual(true);
                expect(wrapper.text().includes(CATALOG_APP.display_name)).toEqual(true);
            });

            it('returns DANGER text only for first', () => {
                const SOURCE_WITH_ERRORS = {
                    applications: [{
                        application_type_id: COSTMANAGEMENT_APP.id,
                        availability_status_error: ERRORMESSAGE,
                        availability_status: 'unavailable'
                    }, {
                        availability_status: null,
                        application_type_id: CATALOG_APP.id,
                        availability_status_error: ERRORMESSAGE2
                    }]
                };

                const wrapper = mount(wrapperWithIntl(getStatusTooltipText('unavailable', SOURCE_WITH_ERRORS, APPTYPES)));

                expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
                expect(wrapper.text().includes(COSTMANAGEMENT_APP.display_name)).toEqual(true);

                expect(wrapper.text().includes(ERRORMESSAGE2)).toEqual(false);
                expect(wrapper.text().includes(CATALOG_APP.display_name)).toEqual(false);
            });

            it('returns unknown by default', () => {
                const wrapper = mount(wrapperWithIntl(getStatusTooltipText('some nonsense', SOURCE, APPTYPES)));

                expect(wrapper.text()).toEqual('Status has not been verified.');
            });
        });

        describe('availabilityFormatter', () => {
            const SOURCE_WITH_APP = {
                applications: [{ availability_status: 'unavailable' }]
            };

            it('returns OK text', () => {
                const wrapper = mount(wrapperWithIntl(availabilityFormatter('available', SOURCE_WITH_APP, { appTypes: APPTYPES })));

                expect(wrapper.find(CheckCircleIcon)).toHaveLength(1);
                expect(wrapper.text().includes('OK')).toEqual(true);
            });

            it('returns WARNING text', () => {
                const wrapper = mount(wrapperWithIntl(availabilityFormatter('partially_available', SOURCE_WITH_APP, { appTypes: APPTYPES })));

                expect(wrapper.find(ExclamationTriangleIcon)).toHaveLength(1);
                expect(wrapper.text().includes('Partially available')).toEqual(true);
            });

            it('returns DANGER text', () => {
                const wrapper = mount(wrapperWithIntl(availabilityFormatter('unavailable', SOURCE_WITH_APP, { appTypes: APPTYPES })));

                expect(wrapper.find(TimesCircleIcon)).toHaveLength(1);
                expect(wrapper.text().includes('Unavailable')).toEqual(true);
            });

            it('returns unknown by default', () => {
                const wrapper = mount(wrapperWithIntl(availabilityFormatter('some nonsense', SOURCE_WITH_APP, { appTypes: APPTYPES })));

                expect(wrapper.find(QuestionCircleIcon)).toHaveLength(1);
                expect(wrapper.text().includes('Unknown')).toEqual(true);
            });

            it('returns -- when no apps attached', () => {
                const wrapper = mount(wrapperWithIntl(availabilityFormatter('some nonsense', SOURCE, { appTypes: APPTYPES })));

                expect(wrapper.text().includes('--')).toEqual(true);
                expect(ReactDOMServer.renderToStaticMarkup(wrapper.find(Popover).props().bodyContent)).toEqual('<h1>No application connected.</h1>');
            });
        });

        describe('formatAvailibilityErrors', () => {
            const ERRORMESSAGE = 'some error';

            const SOURCE_WITH_ERROR = {
                applications: [{
                    application_type_id: COSTMANAGEMENT_APP.id,
                    availability_status_error: ERRORMESSAGE,
                    availability_status: 'unavailable'
                }]
            };

            it('returns application error', () => {
                const wrapper = mount(wrapperWithIntl(formatAvailibilityErrors(SOURCE_WITH_ERROR, APPTYPES)));

                expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
                expect(wrapper.text().includes(COSTMANAGEMENT_APP.display_name)).toEqual(true);
            });

            it('returns application error with unfound appnam', () => {
                const EMPTY_APP_TYPES = [];

                const wrapper = mount(wrapperWithIntl(formatAvailibilityErrors(SOURCE_WITH_ERROR, EMPTY_APP_TYPES)));

                expect(wrapper.text().includes(ERRORMESSAGE)).toEqual(true);
                expect(wrapper.text().includes(COSTMANAGEMENT_APP.display_name)).toEqual(false);
            });

            it('returns unknown application error', () => {
                const SOURCE_WITH_UNDEF_ERROR = {
                    applications: [{
                        application_type_id: COSTMANAGEMENT_APP.id,
                        availability_status_error: null,
                        availability_status: 'unavailable'
                    }]
                };

                const wrapper = mount(wrapperWithIntl(formatAvailibilityErrors(SOURCE_WITH_UNDEF_ERROR, APPTYPES)));

                expect(wrapper.text().includes('Unknown application error')).toEqual(true);
                expect(wrapper.text().includes(COSTMANAGEMENT_APP.display_name)).toEqual(true);
            });

            it('returns unknown source error', () => {
                const wrapper = mount(wrapperWithIntl(formatAvailibilityErrors(SOURCE, APPTYPES)));

                expect(wrapper.text().includes('Unknown source error.')).toEqual(true);
            });

            it('returns unknown error', () => {
                const SOURCE_WITH_UNDEF_ERROR = {
                    applications: [{
                        application_type_id: COSTMANAGEMENT_APP.id,
                        availability_status_error: null,
                        availability_status: null
                    }]
                };

                const wrapper = mount(wrapperWithIntl(formatAvailibilityErrors(SOURCE_WITH_UNDEF_ERROR, APPTYPES)));

                expect(wrapper.text().includes('Unknown error')).toEqual(true);
                expect(wrapper.text().includes(COSTMANAGEMENT_APP.display_name)).toEqual(false);
            });
        });
    });
});
