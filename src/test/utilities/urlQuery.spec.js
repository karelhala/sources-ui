import { parseQuery, updateQuery } from '../../Utilities/urlQuery';

describe('urlQuery helpers', () => {
    let tmpLocation;

    beforeEach(() => {
        tmpLocation = Object.assign({}, window.location);

        delete window.location;

        window.location = {};
    });

    afterEach(() => {
        window.location = tmpLocation;
    });

    describe('updateQuery', () => {
        let spy;
        let params;
        let expectedQuery;

        let tmpHistory;

        beforeEach(() => {
            tmpHistory = Object.assign({}, window.history);

            spy = jest.fn();

            delete window.history;

            window.history = {
                replaceState: spy
            };

            window.location.pathname = 'sources';

            params = {
                sortBy: 'name',
                sortDirection: 'asc',
                pageNumber: '12',
                pageSize: '50',
                filterValue: {
                    name: 'pepa',
                    source_type_id: ['125', '542', '1']
                }
            };

            expectedQuery = 'sources?sort_by[]=name:asc&limit=50&offset=550&filter[name][contains_i]=pepa&filter[source_type_id][]=125&filter[source_type_id][]=542&filter[source_type_id][]=1';
        });

        afterEach(() => {
            window.history = tmpHistory;
        });

        it('updates query when is different', () => {
            updateQuery(params);

            expect(spy).toHaveBeenCalledWith('', '', decodeURIComponent(expectedQuery));
        });

        it('do not update query when it is the same', () => {
            window.location.href = expectedQuery;

            updateQuery(params);

            expect(spy).not.toHaveBeenCalled();
        });

        it('empty filterValue', () => {
            params = {
                ...params,
                filterValue: {}
            };

            expectedQuery = 'sources?sort_by[]=name:asc&limit=50&offset=550';

            updateQuery(params);

            expect(spy).toHaveBeenCalledWith('', '', decodeURIComponent(expectedQuery));
        });
    });

    describe('parseQuery', () => {
        it('handles empty search', () => {
            window.location.search = '';

            const result = parseQuery();

            expect(result).toEqual({});
        });

        describe('sort by', () => {
            it('handles sort by', () => {
                window.location.search = '?sort_by[]=name';

                const result = parseQuery();

                expect(result).toEqual({
                    sortBy: 'name',
                    sortDirection: 'desc'
                });
            });

            it('handles sort by with asc', () => {
                window.location.search = '?sort_by[]=name:asc';

                const result = parseQuery();

                expect(result).toEqual({
                    sortBy: 'name',
                    sortDirection: 'asc'
                });
            });

            it('handles sort by with nonsense direction', () => {
                window.location.search = '?sort_by[]=name:ascii';

                const result = parseQuery();

                expect(result).toEqual({
                    sortBy: 'name',
                    sortDirection: 'desc'
                });
            });

            it('handles unpermitted sort by by setting default state', () => {
                window.location.search = '?sort_by[]=nonsense';

                const result = parseQuery();

                expect(result).toEqual({
                    sortBy: 'created_at',
                    sortDirection: 'desc'
                });
            });
        });

        describe('pagination', () => {
            it('handles pagination', () => {
                window.location.search = '?limit=50&offset=0';

                const result = parseQuery();

                expect(result).toEqual({
                    pageNumber: 1,
                    pageSize: 50
                });
            });

            it('handles pagination', () => {
                window.location.search = '?limit=50&offset=50';

                const result = parseQuery();

                expect(result).toEqual({
                    pageNumber: 2,
                    pageSize: 50
                });
            });

            it('handles pagination 200/50 = 4', () => {
                window.location.search = '?limit=50&offset=200';

                const result = parseQuery();

                expect(result).toEqual({
                    pageNumber: 5,
                    pageSize: 50
                });
            });

            it('handles pagination 200/4 = 50', () => {
                window.location.search = '?limit=4&offset=200';

                const result = parseQuery();

                expect(result).toEqual({
                    pageNumber: 51,
                    pageSize: 4
                });
            });

            it('handles pagination when there are notnumbers', () => {
                window.location.search = '?limit=aword&offset=50';

                const result = parseQuery();

                expect(result).toEqual({});
            });
        });

        describe('filterValue', () => {
            it('handles name filtering', () => {
                window.location.search = '?filter[name][contains_i]=hledamjmeno';

                const result = parseQuery();

                expect(result).toEqual({
                    filterValue: {
                        name: 'hledamjmeno'
                    }
                });
            });

            it('handles sourceType filtering', () => {
                window.location.search = '?filter[source_type_id][]=3&filter[source_type_id][]=2';

                const result = parseQuery();

                expect(result).toEqual({
                    filterValue: {
                        source_type_id: ['3', '2']
                    }
                });
            });
        });

        it('combined query', () => {
            window.location.search =
            '?sort_by[]=name:asc&limit=50&offset=200&filter[name][contains_i]=hledamjmeno&filter[source_type_id][]=3&filter[source_type_id][]=2';

            const result = parseQuery();

            expect(result).toEqual({
                sortBy: 'name',
                sortDirection: 'asc',
                pageNumber: 5,
                pageSize: 50,
                filterValue: {
                    name: 'hledamjmeno',
                    source_type_id: ['3', '2']
                }
            });
        });
    });
});
