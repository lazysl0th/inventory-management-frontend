import { useSearchParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { InventoryList } from '@/widgets/InventoryList'
import { Trans, useTranslation } from 'react-i18next'
import { skipToken } from '@reduxjs/toolkit/query'
import { useSearchInventoriesQuery } from '@/entities/inventory'

const SearchPage = () => {
    const { t } = useTranslation('inventory')
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q')

    const {
        data: searchResult = [],
        isLoading: searchIsLoading,
        error: searchError,
    } = useSearchInventoriesQuery(query ? { query } : skipToken)

    return (
        <Container className='pt-2 pb-5'>
            {searchResult?.length === 0 
                ? (
                    <h2 className='align-self-center'>
                        <Trans
                            t={t} 
                            i18nKey="inventory:searchResults" 
                            values={{ query }}
                            components={{ italic: <em /> }}
                        />
                    </h2>
                ) :
                    (<InventoryList
                        isLoading={searchIsLoading}
                        data={searchResult}
                        error={searchError}
                    >
                        <h2 className='mb-0'>{t('inventory:listTitle.searchResults')}</h2>
                    </InventoryList>)}
        </Container>
    )
}

export default SearchPage
